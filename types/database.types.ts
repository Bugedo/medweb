export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contactos: {
        Row: {
          created_at: string | null
          dni: string
          email: string
          id: string
          localidad: string
          nombre: string
          status: string | null
          telefono: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dni: string
          email: string
          id?: string
          localidad: string
          nombre: string
          status?: string | null
          telefono: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dni?: string
          email?: string
          id?: string
          localidad?: string
          nombre?: string
          status?: string | null
          telefono?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prefichas: {
        Row: {
          apellido_cliente: string | null
          archivo_adjunto: string | null
          beneficiario_apellido_nombres: string | null
          beneficiario_dni: string | null
          beneficiario_fecha_nacimiento: string | null
          canal_afiliacion: string[] | null
          cantidad_capitas: string | null
          created_at: string | null
          dni: string | null
          email: string | null
          id: string
          localidad_provincia: string | null
          nombre_cliente: string | null
          numero_celular: string | null
          observaciones: string | null
          origen_dato: string[] | null
          plan: string | null
          porcentaje_descuento: string | null
          precio_lista: string | null
          status: string | null
          tercero_apellido_nombres: string | null
          tercero_email: string | null
          tercero_numero_celular: string | null
          updated_at: string | null
          vendedor: string | null
          vendor_id: string | null
          vigencia_cobertura: string | null
        }
        Insert: {
          apellido_cliente?: string | null
          archivo_adjunto?: string | null
          beneficiario_apellido_nombres?: string | null
          beneficiario_dni?: string | null
          beneficiario_fecha_nacimiento?: string | null
          canal_afiliacion?: string[] | null
          cantidad_capitas?: string | null
          created_at?: string | null
          dni?: string | null
          email?: string | null
          id?: string
          localidad_provincia?: string | null
          nombre_cliente?: string | null
          numero_celular?: string | null
          observaciones?: string | null
          origen_dato?: string[] | null
          plan?: string | null
          porcentaje_descuento?: string | null
          precio_lista?: string | null
          status?: string | null
          tercero_apellido_nombres?: string | null
          tercero_email?: string | null
          tercero_numero_celular?: string | null
          updated_at?: string | null
          vendedor?: string | null
          vendor_id?: string | null
          vigencia_cobertura?: string | null
        }
        Update: {
          apellido_cliente?: string | null
          archivo_adjunto?: string | null
          beneficiario_apellido_nombres?: string | null
          beneficiario_dni?: string | null
          beneficiario_fecha_nacimiento?: string | null
          canal_afiliacion?: string[] | null
          cantidad_capitas?: string | null
          created_at?: string | null
          dni?: string | null
          email?: string | null
          id?: string
          localidad_provincia?: string | null
          nombre_cliente?: string | null
          numero_celular?: string | null
          observaciones?: string | null
          origen_dato?: string[] | null
          plan?: string | null
          porcentaje_descuento?: string | null
          precio_lista?: string | null
          status?: string | null
          tercero_apellido_nombres?: string | null
          tercero_email?: string | null
          tercero_numero_celular?: string | null
          updated_at?: string | null
          vendedor?: string | null
          vendor_id?: string | null
          vigencia_cobertura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefichas_unified_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          code: string
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
