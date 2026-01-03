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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          overtime: number | null
          profile_id: string
          status: string | null
          work_hours: number | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          overtime?: number | null
          profile_id: string
          status?: string | null
          work_hours?: number | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          overtime?: number | null
          profile_id?: string
          status?: string | null
          work_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bank_details: {
        Row: {
          account_number: string | null
          bank_name: string | null
          branch_name: string | null
          created_at: string | null
          id: string
          ifsc_code: string | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          employee_count: number | null
          head_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          employee_count?: number | null
          head_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          employee_count?: number | null
          head_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_id_fkey"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_details: {
        Row: {
          created_at: string | null
          date_of_joining: string | null
          department_id: string | null
          designation: string | null
          employment_type: string | null
          id: string
          profile_id: string
          reporting_manager_id: string | null
          updated_at: string | null
          work_location: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_joining?: string | null
          department_id?: string | null
          designation?: string | null
          employment_type?: string | null
          id?: string
          profile_id: string
          reporting_manager_id?: string | null
          updated_at?: string | null
          work_location?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_joining?: string | null
          department_id?: string | null
          designation?: string | null
          employment_type?: string | null
          id?: string
          profile_id?: string
          reporting_manager_id?: string | null
          updated_at?: string | null
          work_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_details_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_details_reporting_manager_id_fkey"
            columns: ["reporting_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_optional: boolean | null
          name: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_optional?: boolean | null
          name: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_optional?: boolean | null
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          balance_days: number | null
          created_at: string | null
          id: string
          leave_type_id: string
          profile_id: string
          total_days: number | null
          updated_at: string | null
          used_days: number | null
          year: number
        }
        Insert: {
          balance_days?: number | null
          created_at?: string | null
          id?: string
          leave_type_id: string
          profile_id: string
          total_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          year: number
        }
        Update: {
          balance_days?: number | null
          created_at?: string | null
          id?: string
          leave_type_id?: string
          profile_id?: string
          total_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          created_at: string | null
          end_date: string
          half_day_type: string | null
          id: string
          is_half_day: boolean | null
          leave_type_id: string
          profile_id: string
          reason: string
          rejection_comment: string | null
          start_date: string
          status: string | null
          total_days: number
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date: string
          half_day_type?: string | null
          id?: string
          is_half_day?: boolean | null
          leave_type_id: string
          profile_id: string
          reason: string
          rejection_comment?: string | null
          start_date: string
          status?: string | null
          total_days: number
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          end_date?: string
          half_day_type?: string | null
          id?: string
          is_half_day?: boolean | null
          leave_type_id?: string
          profile_id?: string
          reason?: string
          rejection_comment?: string | null
          start_date?: string
          status?: string | null
          total_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          code: string
          created_at: string | null
          days_allowed: number | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          days_allowed?: number | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          days_allowed?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      login_history: {
        Row: {
          browser: string | null
          device: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          location: string | null
          login_time: string | null
          logout_time: string | null
          user_id: string
        }
        Insert: {
          browser?: string | null
          device?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_time?: string | null
          logout_time?: string | null
          user_id: string
        }
        Update: {
          browser?: string | null
          device?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_time?: string | null
          logout_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhar_number: string | null
          address: string | null
          avatar_url: string | null
          blood_group: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          employee_id: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          name: string
          pan_number: string | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          avatar_url?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          employee_id?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          avatar_url?: string | null
          blood_group?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          employee_id?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      salary_details: {
        Row: {
          basic: number | null
          created_at: string | null
          da: number | null
          esi: number | null
          gross_salary: number | null
          hra: number | null
          id: string
          net_salary: number | null
          pf: number | null
          professional_tax: number | null
          profile_id: string
          special_allowance: number | null
          updated_at: string | null
        }
        Insert: {
          basic?: number | null
          created_at?: string | null
          da?: number | null
          esi?: number | null
          gross_salary?: number | null
          hra?: number | null
          id?: string
          net_salary?: number | null
          pf?: number | null
          professional_tax?: number | null
          profile_id: string
          special_allowance?: number | null
          updated_at?: string | null
        }
        Update: {
          basic?: number | null
          created_at?: string | null
          da?: number | null
          esi?: number | null
          gross_salary?: number | null
          hra?: number | null
          id?: string
          net_salary?: number | null
          pf?: number | null
          professional_tax?: number | null
          profile_id?: string
          special_allowance?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hr" | "employee"
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
    Enums: {
      app_role: ["admin", "hr", "employee"],
    },
  },
} as const
