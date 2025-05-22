export interface FormField {
  id: string;
  name: string;
  type: string;
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  dependencies: string[]; // IDs of forms this form depends on
}

export interface PrefillMapping {
  sourceFormId: string;
  sourceFieldId: string;
  targetFieldId: string;
}

export interface FormPrefillConfig {
  formId: string;
  mappings: PrefillMapping[];
}

export interface GlobalData {
  id: string;
  name: string;
  value: any;
}

export type DataSource = {
  type: 'direct' | 'transitive' | 'global';
  formId?: string;
  fieldId?: string;
  globalDataId?: string;
}; 