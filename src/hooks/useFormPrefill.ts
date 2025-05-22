import { useState, useEffect } from 'react';
import type { Form, FormPrefillConfig, PrefillMapping } from '../types/form';
import { fetchFormGraph, findTransitiveDependencies } from '../services/api';

export const useFormPrefill = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefillConfigs, setPrefillConfigs] = useState<FormPrefillConfig[]>([]);

  useEffect(() => {
    const loadForms = async () => {
      try {
        const data = await fetchFormGraph();
        setForms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forms');
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  const getFormPrefillConfig = (formId: string): FormPrefillConfig => {
    return prefillConfigs.find(config => config.formId === formId) || {
      formId,
      mappings: []
    };
  };

  const addPrefillMapping = (formId: string, mapping: PrefillMapping) => {
    setPrefillConfigs(prev => {
      const existingConfig = prev.find(config => config.formId === formId);
      if (existingConfig) {
        return prev.map(config =>
          config.formId === formId
            ? { ...config, mappings: [...config.mappings, mapping] }
            : config
        );
      }
      return [...prev, { formId, mappings: [mapping] }];
    });
  };

  const removePrefillMapping = (formId: string, targetFieldId: string) => {
    setPrefillConfigs(prev =>
      prev.map(config =>
        config.formId === formId
          ? {
              ...config,
              mappings: config.mappings.filter(m => m.targetFieldId !== targetFieldId)
            }
          : config
      )
    );
  };

  const getAvailableDataSources = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (!form) return {
      direct: [],
      transitive: [],
      global: [
        { type: 'global' as const, globalDataId: 'org_name', name: 'Organization Name' },
        { type: 'global' as const, globalDataId: 'action_id', name: 'Action ID' }
      ]
    };

    const directDeps = form.dependencies;
    const transitiveDeps = findTransitiveDependencies(forms, formId);

    return {
      direct: directDeps.flatMap(depId => {
        const depForm = forms.find(f => f.id === depId);
        return depForm?.fields.map(field => ({
          type: 'direct' as const,
          formId: depId,
          fieldId: field.id
        })) || [];
      }),
      transitive: transitiveDeps.flatMap(depId => {
        const depForm = forms.find(f => f.id === depId);
        return depForm?.fields.map(field => ({
          type: 'transitive' as const,
          formId: depId,
          fieldId: field.id
        })) || [];
      }),
      global: [
        { type: 'global' as const, globalDataId: 'org_name', name: 'Organization Name' },
        { type: 'global' as const, globalDataId: 'action_id', name: 'Action ID' }
      ]
    };
  };

  return {
    forms,
    loading,
    error,
    getFormPrefillConfig,
    addPrefillMapping,
    removePrefillMapping,
    getAvailableDataSources
  };
}; 