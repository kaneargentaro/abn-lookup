export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      abn_records: {
        Row: {
          abn: string;
          abn_status: string;
          abn_status_from_date: string;
          created_at: string | null;
          entity_type_ind: string | null;
          entity_type_text: string | null;
          record_last_updated_date: string;
          updated_at: string | null;
        };
        Insert: {
          abn: string;
          abn_status: string;
          abn_status_from_date: string;
          created_at?: string | null;
          entity_type_ind?: string | null;
          entity_type_text?: string | null;
          record_last_updated_date: string;
          updated_at?: string | null;
        };
        Update: {
          abn?: string;
          abn_status?: string;
          abn_status_from_date?: string;
          created_at?: string | null;
          entity_type_ind?: string | null;
          entity_type_text?: string | null;
          record_last_updated_date?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      asic_numbers: {
        Row: {
          abn: string;
          asic_number: string;
          created_at: string | null;
        };
        Insert: {
          abn: string;
          asic_number: string;
          created_at?: string | null;
        };
        Update: {
          abn?: string;
          asic_number?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'asic_numbers_abn_fkey';
            columns: ['abn'];
            isOneToOne: true;
            referencedRelation: 'abn_records';
            referencedColumns: ['abn'];
          },
        ];
      };
      business_addresses: {
        Row: {
          abn: string;
          created_at: string | null;
          postcode: string | null;
          state_code: string | null;
        };
        Insert: {
          abn: string;
          created_at?: string | null;
          postcode?: string | null;
          state_code?: string | null;
        };
        Update: {
          abn?: string;
          created_at?: string | null;
          postcode?: string | null;
          state_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'business_addresses_abn_fkey';
            columns: ['abn'];
            isOneToOne: true;
            referencedRelation: 'abn_records';
            referencedColumns: ['abn'];
          },
        ];
      };
      dgr_entries: {
        Row: {
          abn: string;
          created_at: string | null;
          id: number;
          status: string | null;
          status_from_date: string;
          text: string | null;
          type: string | null;
        };
        Insert: {
          abn: string;
          created_at?: string | null;
          id?: number;
          status?: string | null;
          status_from_date: string;
          text?: string | null;
          type?: string | null;
        };
        Update: {
          abn?: string;
          created_at?: string | null;
          id?: number;
          status?: string | null;
          status_from_date?: string;
          text?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'dgr_entries_abn_fkey';
            columns: ['abn'];
            isOneToOne: false;
            referencedRelation: 'abn_records';
            referencedColumns: ['abn'];
          },
        ];
      };
      gst_registrations: {
        Row: {
          abn: string;
          created_at: string | null;
          status: string;
          status_from_date: string;
        };
        Insert: {
          abn: string;
          created_at?: string | null;
          status: string;
          status_from_date: string;
        };
        Update: {
          abn?: string;
          created_at?: string | null;
          status?: string;
          status_from_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'gst_registrations_abn_fkey';
            columns: ['abn'];
            isOneToOne: true;
            referencedRelation: 'abn_records';
            referencedColumns: ['abn'];
          },
        ];
      };
      legal_entity: {
        Row: {
          abn: string;
          created_at: string | null;
          family_name: string | null;
          given_name_1: string | null;
          given_name_2: string | null;
          title: string | null;
          type: string;
        };
        Insert: {
          abn: string;
          created_at?: string | null;
          family_name?: string | null;
          given_name_1?: string | null;
          given_name_2?: string | null;
          title?: string | null;
          type: string;
        };
        Update: {
          abn?: string;
          created_at?: string | null;
          family_name?: string | null;
          given_name_1?: string | null;
          given_name_2?: string | null;
          title?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'legal_entity_abn_fkey';
            columns: ['abn'];
            isOneToOne: true;
            referencedRelation: 'abn_records';
            referencedColumns: ['abn'];
          },
        ];
      };
      main_entity: {
        Row: {
          abn: string;
          created_at: string | null;
          text: string | null;
          type: string;
        };
        Insert: {
          abn: string;
          created_at?: string | null;
          text?: string | null;
          type: string;
        };
        Update: {
          abn?: string;
          created_at?: string | null;
          text?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'main_entity_abn_fkey';
            columns: ['abn'];
            isOneToOne: true;
            referencedRelation: 'abn_records';
            referencedColumns: ['abn'];
          },
        ];
      };
      other_entity_names: {
        Row: {
          abn: string;
          created_at: string | null;
          id: number;
          text: string | null;
          type: string;
        };
        Insert: {
          abn: string;
          created_at?: string | null;
          id?: number;
          text?: string | null;
          type: string;
        };
        Update: {
          abn?: string;
          created_at?: string | null;
          id?: number;
          text?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'other_entity_names_abn_fkey';
            columns: ['abn'];
            isOneToOne: false;
            referencedRelation: 'abn_records';
            referencedColumns: ['abn'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
