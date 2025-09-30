import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface FormattedTextProps {
  content: string;
  style?: React.CSSProperties;
}

interface FormatPattern {
  regex: RegExp;
  render: (text: string, key: number) => React.ReactNode;
}

interface Match {
  start: number;
  end: number;
  content: string;
  render: (text: string, key: number) => React.ReactNode;
  innerText: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ content, style }) => {
  const formatText = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let partKey = 0;

    const patterns: FormatPattern[] = [
      { 
        regex: /\*\*(.*?)\*\*/g, 
        render: (innerText: string, key: number) => <Text key={key} strong>{innerText}</Text> 
      },
      { 
        regex: /__(.*?)__/g, 
        render: (innerText: string, key: number) => <Text key={key} underline>{innerText}</Text> 
      },
      { 
        regex: /\*(.*?)\*/g, 
        render: (innerText: string, key: number) => <Text key={key} italic>{innerText}</Text> 
      },
      { 
        regex: /`(.*?)`/g, 
        render: (innerText: string, key: number) => <Text key={key} code>{innerText}</Text> 
      },
      { 
        regex: /~~(.*?)~~/g, 
        render: (innerText: string, key: number) => <Text key={key} delete>{innerText}</Text> 
      },
    ];

    const allMatches: Match[] = [];

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

    allMatches.sort((a, b) => a.start - b.start);

    const validMatches: Match[] = [];
    let lastEnd = 0;
    
    allMatches.forEach((match) => {
      if (match.start >= lastEnd) {
        validMatches.push(match);
        lastEnd = match.end;
      }
    });

    validMatches.forEach((match) => {
      if (match.start > currentIndex) {
        const beforeText = text.slice(currentIndex, match.start);
        if (beforeText) {
          parts.push(<span key={`text-${partKey}`}>{beforeText}</span>);
          partKey += 1;
        }
      }

      parts.push(match.render(match.innerText, partKey));
      partKey += 1;

      currentIndex = match.end;
    });

    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText) {
        parts.push(<span key={`text-${partKey}`}>{remainingText}</span>);
      }
    }

    return parts.length > 0 ? parts : [<span key="default">{text}</span>];
  };

  const lines = content.split('\n');
  
  return (
    <div style={style}>
      {lines.map((line) => {
        const lineId = `line-${line.substring(0, 10)}-${Math.random().toString(36).substr(2, 9)}`;
        return (
          <div key={lineId}>
            {formatText(line)}
            {lines.indexOf(line) < lines.length - 1 && <br />}
          </div>
        );
      })}
    </div>
  );
};

export default FormattedText;
