import { useState } from 'react'
import { FormList } from './components/FormList'
import { PrefillConfig } from './components/PrefillConfig'
import { useFormPrefill } from './hooks/useFormPrefill'
import type { PrefillMapping } from './types/form'
import './styles/PrefillConfig.css'
import './styles/FormList.css'
import './App.css'

function App() {
  const {
    forms,
    loading,
    error,
    getFormPrefillConfig,
    addPrefillMapping,
    removePrefillMapping,
    getAvailableDataSources
  } = useFormPrefill()

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const selectedForm = forms.find(f => f.id === selectedFormId)
  const prefillConfig = selectedFormId ? getFormPrefillConfig(selectedFormId) : null
  const availableDataSources = selectedFormId ? getAvailableDataSources(selectedFormId) : null

  const handleAddMapping = (mapping: PrefillMapping) => {
    if (selectedFormId) {
      addPrefillMapping(selectedFormId, mapping)
    }
  }

  const handleRemoveMapping = (targetFieldId: string) => {
    if (selectedFormId) {
      removePrefillMapping(selectedFormId, targetFieldId)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Form Prefill Configuration</h1>
      </header>
      <main>
        <div className="content">
          <div className="sidebar">
            <FormList
              forms={forms}
              selectedFormId={selectedFormId}
              onSelectForm={setSelectedFormId}
            />
          </div>
          <div className="main">
            {selectedForm && prefillConfig && availableDataSources ? (
              <PrefillConfig
                form={selectedForm}
                mappings={prefillConfig.mappings}
                availableDataSources={availableDataSources}
                onAddMapping={handleAddMapping}
                onRemoveMapping={handleRemoveMapping}
              />
            ) : (
              <div className="no-form-selected">
                Select a form to configure prefill mappings
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
