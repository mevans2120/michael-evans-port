'use client';

import { useCallback } from 'react';
import { TextArea, Stack, Text } from '@sanity/ui';
import { set, unset } from 'sanity';

interface AsciiArtInputProps {
  elementProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  onChange: (patch: unknown) => void;
  value?: string;
}

/**
 * Custom input component for ASCII art fields.
 * Renders a textarea with monospace font so users can see proper character alignment.
 */
export function AsciiArtInput(props: AsciiArtInputProps) {
  const { elementProps, onChange, value = '' } = props;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  return (
    <Stack space={3}>
      <TextArea
        {...elementProps}
        onChange={handleChange}
        value={value}
        rows={15}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: '12px',
          lineHeight: '1.2',
          whiteSpace: 'pre',
          overflowX: 'auto',
        }}
      />
      <Text size={1} muted>
        Use a monospace font when creating ASCII art. Each character should occupy the same width.
      </Text>
    </Stack>
  );
}
