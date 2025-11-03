'use client';

import React, { useState } from 'react';
import { Zap, Plus, Clock, CheckCircle, Trash2, Edit } from 'lucide-react';

export default function Home() {
  const [edit, setEdit] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');
  const [input, setInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      description: 'Every Monday, remind me to update my repo and post a tweet',
      schedule: 'Every Monday at 9:00 AM',
      status: 'active',
      nextRun: 'Mon, Nov 4, 2025'
    }
  ]);

  function nextRunMock() {
    return new Date(Date.now() + 2 * 60 * 1000).toLocaleString();
  }

  function handleCreate() {
    if (!input.trim()) return;
    setIsCreating(true);
    const newWorkflow = {
      id: workflows.length + 1,
      description: input.trim(),
      schedule: 'Parsed schedule',
      status: 'active',
      nextRun: nextRunMock()
    };
    setWorkflows([newWorkflow, ...workflows]);
    setInput('');
    setIsCreating(false);
  }

  function handleEdit(id: number) {
    if (!editInput.trim()) return;
    setWorkflows(workflows.map(w => w.id === id ? { ...w, description: editInput.trim() } : w));
    setEdit(null);
    setEditInput('');
  }

  function startEdit(id: number, currentDescription: string) {
    setEdit(id);
    setEditInput(currentDescription);
  }

  function cancelEdit() {
    setEdit(null);
    setEditInput('');
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="border-b border-[#E5D5C0] bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">FlowSync</h1>
              <p className="text-sm text-gray-500">AI Workflow Automator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5D5C0] p-8 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Workflow</h2>
          <p className="text-sm text-gray-500 mb-6">
            Describe your automation in plain English.
          </p>

          <div className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='e.g., "Every weekday at 7am, send me an message telling me to go to the gym"'
              className="w-full h-32 px-4 py-3 bg-[#FFFBF5] border border-[#E5D5C0] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
            <button
              onClick={handleCreate}
              disabled={!input.trim() || isCreating}
              className="w-full bg-linear-to-r from-amber-400 to-orange-500 text-white font-medium py-3 px-6 rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Workflow
                </>
              )}
            </button>
          </div>
        </div>

        {/* Workflows */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Your Workflows</h2>
            <span className="text-sm text-gray-500">{workflows.length} active</span>
          </div>

          {workflows.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5D5C0] p-12 text-center">
              <div className="w-16 h-16 bg-[#FFFBF5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
              <p className="text-sm text-gray-500">Create your first automation above to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflows.map((w) => (
                <div
                  key={w.id}
                  className="bg-white rounded-2xl shadow-sm border border-[#E5D5C0] p-6 hover:shadow-md transition-shadow"
                >
                  {edit === w.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Edit Workflow Description
                        </label>
                        <textarea
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          placeholder="Describe your automation in plain English"
                          className="w-full h-32 px-4 py-3 bg-[#FFFBF5] border border-[#E5D5C0] rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(w.id)}
                          disabled={!editInput.trim()}
                          className="flex-1 bg-linear-to-r from-amber-400 to-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:from-amber-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal view
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                            active
                          </span>
                        </div>
                        <p className="text-gray-900 mb-3">{w.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{w.schedule}</span>
                          </div>
                          <div>
                            Next run:{' '}
                            <span className="font-medium text-gray-700">{w.nextRun}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => startEdit(w.id, w.description)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setWorkflows(workflows.filter((x) => x.id !== w.id))
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
