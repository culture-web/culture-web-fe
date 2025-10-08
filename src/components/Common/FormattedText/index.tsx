import React from 'react';
import { Typography } from 'antd';

const { Text, Title } = Typography;

interface FormattedTextProps {
  content: string;
  style?: React.CSSProperties;
}

interface FormatPattern {
  regex: RegExp;
  render: (text: string, key: string | number) => React.ReactNode;
}

interface Match {
  start: number;
  end: number;
  content: string;
  render: (text: string, key: string | number) => React.ReactNode;
  innerText: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ content, style }) => {
  const formatInlineText = (text: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let partKey = 0;

    // Enhanced patterns for better markdown support
    const patterns: FormatPattern[] = [
      { 
        regex: /\*\*(.*?)\*\*/g, 
        render: (innerText: string, key: string | number) => <Text key={key} strong>{innerText}</Text> 
      },
      { 
        regex: /__(.*?)__/g, 
        render: (innerText: string, key: string | number) => <Text key={key} underline>{innerText}</Text> 
      },
      { 
        regex: /`(.*?)`/g, 
        render: (innerText: string, key: string | number) => <Text key={key} code>{innerText}</Text> 
      },
      { 
        regex: /~~(.*?)~~/g, 
        render: (innerText: string, key: string | number) => <Text key={key} delete>{innerText}</Text> 
      },
      {
        regex: /\*(.*?)\*/g,
        render: (innerText: string, key: string | number) => <Text key={key} italic>{innerText}</Text>
      },
      {
        regex: /_(.*?)_/g,
        render: (innerText: string, key: string | number) => <Text key={key} italic>{innerText}</Text>
      },
    ];

    const allMatches: Match[] = [];

    // Find all matches
    patterns.forEach(({ regex, render }) => {
      const regexCopy = new RegExp(regex.source, regex.flags);
      let match = regexCopy.exec(text);
      while (match !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[0],
          render,
          innerText: match[1],
        });
        match = regexCopy.exec(text);
      }
    });

    // Sort by position
    allMatches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (prioritize longer matches)
    const validMatches: Match[] = [];
    let lastEnd = 0;
    allMatches.forEach((match) => {
      if (match.start >= lastEnd) {
        validMatches.push(match);
        lastEnd = match.end;
      }
    });

    // Build the result
    validMatches.forEach((match) => {
      // Add text before the match
      if (match.start > currentIndex) {
        const beforeText = text.slice(currentIndex, match.start);
        if (beforeText) {
          partKey += 1;
          parts.push(<span key={`${keyPrefix}-text-${partKey}`}>{beforeText}</span>);
        }
      }
      // Add the formatted match
      partKey += 1;
      parts.push(match.render(match.innerText, `${keyPrefix}-format-${partKey}`));
      currentIndex = match.end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText) {
        partKey += 1;
        parts.push(<span key={`${keyPrefix}-text-${partKey}`}>{remainingText}</span>);
      }
    }

    return parts.length > 0 ? parts : [<span key={`${keyPrefix}-default`}>{text}</span>];
  };

  const renderLine = (line: string, lineIndex: number): React.ReactNode => {
    // Check if line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      
      // Apply inline formatting to heading text
      const formattedHeadingContent = formatInlineText(headingText, `heading-${lineIndex}`);
      
      return (
        <Title 
          key={`heading-${lineIndex}`} 
          level={Math.min(level, 5) as 1 | 2 | 3 | 4 | 5}
          style={{ 
            marginTop: level === 1 ? '24px' : '16px',
            marginBottom: '8px',
            color: '#2b2d38'
          }}
        >
          {formattedHeadingContent}
        </Title>
      );
    }

    // Regular line with inline formatting
    return (
      <div key={`line-${lineIndex}`}>
        {formatInlineText(line, `line-${lineIndex}`)}
      </div>
    );
  };

  // Split content by line breaks and handle empty lines
  const lines = content.split(/\n/);
  
  return (
    <div style={style}>
      {lines.map((line, index) => {
        if (line.trim() === '') {
          return <div key={`empty-line-${index}`} style={{ height: '16px' }} />;
        }
        return renderLine(line, index);
      })}
    </div>
  );
};

export default FormattedText;
