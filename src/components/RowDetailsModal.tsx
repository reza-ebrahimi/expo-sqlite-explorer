import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, Platform } from 'react-native';

import { setAlpha } from '../theme/utils';
import type { SqliteExplorerTheme } from '../theme';
import type { ColumnInfo, SqlParameter } from '../types/database';
import type { TableRecord, ExtendedPressableState } from '../types/explorer';
import { copyToClipboard } from '../utils/clipboard';
import { CloseIcon, CopyIcon } from '../icons';
import { NullBadge } from './NullBadge';

export interface RowDetailsModalProps {
  visible: boolean;
  columns: ColumnInfo[];
  record: TableRecord | null;
  tableName: string | null;
  onClose: () => void;
  theme: SqliteExplorerTheme;
}

export const RowDetailsModal: React.FC<RowDetailsModalProps> = ({
  visible,
  columns,
  record,
  tableName,
  onClose,
  theme,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (columnName: string, value: SqlParameter) => {
    await copyToClipboard(value);
    setCopiedField(columnName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Check visible first, then record
  if (!visible) return null;
  if (!record) return null;

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            width: '80%',
            maxWidth: 600,
            maxHeight: '80%',
            overflow: 'hidden',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: setAlpha(theme.colors.border, 0.3),
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.foreground }}>
              {tableName} - Row Details
            </Text>
            <Pressable onPress={onClose}>
              <CloseIcon size={24} color={theme.colors.foreground} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={{ maxHeight: 500 }}>
            {columns.map((col) => {
              const value = record[col.name];
              const isCopied = copiedField === col.name;
              return (
                <Pressable
                  key={col.cid}
                  onPress={() => handleCopy(col.name, value)}
                  style={(state) => {
                    const { hovered } = state as ExtendedPressableState;
                    return {
                      flexDirection: 'row',
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: setAlpha(theme.colors.border, 0.2),
                      backgroundColor: hovered
                        ? setAlpha(theme.colors.foreground, 0.05)
                        : 'transparent',
                    };
                  }}
                >
                  <View style={{ width: 150 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: theme.colors.foreground,
                        fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                      }}
                    >
                      {col.name}
                    </Text>
                    <Text style={{ fontSize: 10, color: theme.colors.mutedForeground }}>
                      {col.type || 'ANY'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, paddingLeft: 12 }}>
                    {value === null ? (
                      <NullBadge theme={theme} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.colors.foreground,
                          fontFamily: Platform.select({ web: 'monospace', default: undefined }),
                        }}
                      >
                        {String(value)}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: 60, alignItems: 'flex-end' }}>
                    {isCopied ? (
                      <Text style={{ fontSize: 11, color: theme.colors.success }}>Copied!</Text>
                    ) : (
                      <CopyIcon size={14} color={theme.colors.mutedForeground} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
