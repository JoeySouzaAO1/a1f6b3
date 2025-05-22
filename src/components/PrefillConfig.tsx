import { useState } from 'react';
import type { Form, PrefillMapping } from '../types/form';

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
  onRemoveMapping
}: PrefillConfigProps) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFieldClick = (fieldId: string) => {
    setSelectedField(fieldId);
    setShowModal(true);
  };

  const handleSourceSelect = (source: any) => {
    if (selectedField) {
      onAddMapping({
        sourceFormId: source.formId || '',
        sourceFieldId: source.fieldId || '',
        targetFieldId: selectedField
      });
      setShowModal(false);
      setSelectedField(null);
    }
  };

  return (
    <div className="prefill-config">
      <h2>Prefill Configuration for {form.name}</h2>
      <div className="fields">
        {form.fields.map(field => {
          const mapping = mappings.find(m => m.targetFieldId === field.id);
          return (
            <div key={field.id} className="field-item">
              <span>{field.name}</span>
              {mapping ? (
                <div className="mapping">
                  <span>Prefilled from: {mapping.sourceFormId}</span>
                  <button onClick={() => onRemoveMapping(field.id)}>X</button>
                </div>
              ) : (
                <button onClick={() => handleFieldClick(field.id)}>
                  Add Prefill
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Data Source</h3>
            <div className="data-sources">
              <div className="source-group">
                <h4>Direct Dependencies</h4>
                {availableDataSources.direct.map(source => (
                  <button
                    key={`${source.formId}-${source.fieldId}`}
                    onClick={() => handleSourceSelect(source)}
                  >
                    {source.formId} - {source.fieldId}
                  </button>
                ))}
              </div>
              <div className="source-group">
                <h4>Transitive Dependencies</h4>
                {availableDataSources.transitive.map(source => (
                  <button
                    key={`${source.formId}-${source.fieldId}`}
                    onClick={() => handleSourceSelect(source)}
                  >
                    {source.formId} - {source.fieldId}
                  </button>
                ))}
              </div>
              <div className="source-group">
                <h4>Global Data</h4>
                {availableDataSources.global.map(source => (
                  <button
                    key={source.globalDataId}
                    onClick={() => handleSourceSelect(source)}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}; 