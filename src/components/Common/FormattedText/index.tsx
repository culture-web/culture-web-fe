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

interface ParsedTable {
  headers: string[];
  rows: string[][];
}

const FormattedText: React.FC<FormattedTextProps> = ({ content, style }) => {
  const isTableRow = (line: string): boolean => {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|');
  };

  const isTableSeparator = (line: string): boolean => {
    const trimmed = line.trim();
    return /^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(trimmed);
  };

  const parseTableBlock = (blockLines: string[]): ParsedTable | null => {
    if (blockLines.length < 2) return null;
    const [headerLine, separatorLine, ...dataLines] = blockLines;
    if (!isTableRow(headerLine) || !isTableSeparator(separatorLine)) return null;

    const splitCells = (line: string) => line
      .trim()
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim());

    const headers = splitCells(headerLine);
    const rows = dataLines
      .filter((line) => isTableRow(line))
      .map((line) => splitCells(line));

    if (!headers.length) return null;
    return { headers, rows };
  };

  const renderTable = (table: ParsedTable, key: string) => (
    <div key={key} style={{ overflowX: 'auto', margin: '10px 0' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '14px' }}>
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={`${key}-header-${header}-${index}`}
                style={{
                  border: '1px solid #d9d9d9',
                  padding: '8px',
                  textAlign: 'left',
                  background: '#f5f5f5',
                  fontWeight: 600,
                }}
              >
                {formatInlineText(header, `${key}-header-text-${index}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${key}-row-${rowIndex}`}>
              {table.headers.map((_, colIndex) => (
                <td
                  key={`${key}-cell-${rowIndex}-${colIndex}`}
                  style={{ border: '1px solid #e8e8e8', padding: '8px', verticalAlign: 'top' }}
                >
                  {formatInlineText(row[colIndex] || '', `${key}-cell-text-${rowIndex}-${colIndex}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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

  const renderLine = (line: string, contentKey: string): React.ReactNode => {
    // Check if line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];
      
      // Apply inline formatting to heading text
      const formattedHeadingContent = formatInlineText(headingText, `heading-${contentKey}`);
      
      return (
        <Title 
          key={`heading-${contentKey}`} 
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
      <div key={`line-${contentKey}`}>
        {formatInlineText(line, `line-${contentKey}`)}
      </div>
    );
  };

  // Split content by line breaks and handle block structures (tables / lines)
  const lines = content.split(/\n/);
  const nodes: React.ReactNode[] = [];
  let index = 0;
  let emptyLineCounter = 0;

  while (index < lines.length) {
    const line = lines[index];

    // Try markdown table block: header + separator + 0..n data rows
    if (isTableRow(line) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      const blockLines = [line, lines[index + 1]];
      let cursor = index + 2;
      while (cursor < lines.length && isTableRow(lines[cursor])) {
        blockLines.push(lines[cursor]);
        cursor += 1;
      }

      const parsedTable = parseTableBlock(blockLines);
      if (parsedTable) {
        nodes.push(renderTable(parsedTable, `table-${index}`));
        index = cursor;
        continue;
      }
    }

    if (line.trim() === '') {
      emptyLineCounter += 1;
      nodes.push(<div key={`empty-line-${emptyLineCounter}`} style={{ height: '16px' }} />);
      index += 1;
      continue;
    }

    const contentKey = line.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_') || `line-${index}`;
    nodes.push(renderLine(line, contentKey));
    index += 1;
  }
  
  return (
    <div style={style}>
      {nodes}
    </div>
  );
};

export default FormattedText;
