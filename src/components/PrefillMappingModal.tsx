import { useState } from 'react';
import type { DataSource, PrefillMapping } from '../types/form';

interface PrefillMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mapping: PrefillMapping) => void;
  targetFieldId: string;
  availableDataSources: {
    direct: Array<{ type: 'direct'; formId: string; fieldId: string }>;
    transitive: Array<{ type: 'transitive'; formId: string; fieldId: string }>;
    global: Array<{ type: 'global'; globalDataId: string; name: string }>;
  };
}

export const PrefillMappingModal = ({
  isOpen,
  onClose,
  onSave,
  targetFieldId,
  availableDataSources,
}: PrefillMappingModalProps) => {
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  if (!isOpen) return null;

  const handleSourceSelect = (source: DataSource) => {
    setSelectedSource(source);
  };

  const handleSave = () => {
    if (selectedSource) {
      onSave({
        sourceFormId: selectedSource.formId || '',
        sourceFieldId: selectedSource.fieldId || '',
        targetFieldId,
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Configure Prefill Mapping</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <div className="modal-content">
          <div className="data-sources">
            <div className="source-group">
              <h4>Direct Dependencies</h4>
              {availableDataSources.direct.map(source => (
                <button
                  key={`${source.formId}-${source.fieldId}`}
                  onClick={() => handleSourceSelect(source)}
                  className={selectedSource?.formId === source.formId && 
                           selectedSource?.fieldId === source.fieldId ? 'selected' : ''}
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
                  className={selectedSource?.formId === source.formId && 
                           selectedSource?.fieldId === source.fieldId ? 'selected' : ''}
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
                  className={selectedSource?.globalDataId === source.globalDataId ? 'selected' : ''}
                >
                  {source.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button 
            onClick={handleSave} 
            className="save-button"
            disabled={!selectedSource}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}; 