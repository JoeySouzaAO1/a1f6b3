import { useState } from 'react';
import type { Form, PrefillMapping } from '../types/form';
import { PrefillMappingModal } from './PrefillMappingModal';

interface PrefillConfigProps {
  form: Form;
  mappings: PrefillMapping[];
  availableDataSources: {
    direct: Array<{ type: 'direct'; formId: string; fieldId: string }>;
    transitive: Array<{ type: 'transitive'; formId: string; fieldId: string }>;
    global: Array<{ type: 'global'; globalDataId: string; name: string }>;
  };
  onAddMapping: (mapping: PrefillMapping) => void;
  onRemoveMapping: (targetFieldId: string) => void;
}

export const PrefillConfig = ({
  form,
  mappings,
  availableDataSources,
  onAddMapping,
  onRemoveMapping,
}: PrefillConfigProps) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const getMappingForField = (fieldId: string) => {
    return mappings.find(m => m.targetFieldId === fieldId);
  };

  return (
    <div className="prefill-config">
      <h2>Prefill Configuration for {form.name}</h2>
      <div className="fields-list">
        {form.fields.map(field => {
          const mapping = getMappingForField(field.id);
          return (
            <div key={field.id} className="field-row">
              <div className="field-info">
                <span className="field-name">{field.name}</span>
                <span className="field-type">({field.type})</span>
              </div>
              <div className="field-mapping">
                {mapping ? (
                  <div className="mapping-info">
                    <span>
                      Mapped to: {mapping.sourceFormId} - {mapping.sourceFieldId}
                    </span>
                    <button
                      onClick={() => onRemoveMapping(field.id)}
                      className="remove-mapping"
                      title="Remove mapping"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedField(field.id)}
                    className="add-mapping"
                  >
                    Add Mapping
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <PrefillMappingModal
        isOpen={!!selectedField}
        onClose={() => setSelectedField(null)}
        onSave={onAddMapping}
        targetFieldId={selectedField || ''}
        availableDataSources={availableDataSources}
      />
    </div>
  );
}; 