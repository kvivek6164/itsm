'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export interface ConfigColumn {
  field: string;
  header: string;
  width?: string;
}

export interface ConfigRow {
  id: number | string;
  [key: string]: any;
}

interface AddModalProps {
  title: string;
  nameLabel: string;
  onSave: (data: { name: string; description: string; roles: string[] }) => void;
  onClose: () => void;
}

function AddModal({ title, nameLabel, onSave, onClose }: AddModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState('');
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleAssignRole = () => {
    if (roleInput.trim()) {
      setRoles([...roles, roleInput.trim()]);
      setRoleInput('');
      setShowRoleInput(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(`${nameLabel} is required`);
      return;
    }
    onSave({ name: name.trim(), description: description.trim(), roles });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-blue-700">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <Icon name="XIcon" size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Name field */}
          <div className="flex items-start gap-4">
            <label className="w-32 text-sm text-slate-700 pt-2 flex-shrink-0">
              {nameLabel} <span className="text-red-500">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                className="w-full px-3 py-2 text-sm border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
              {nameError && (
                <p className="text-xs text-red-500 mt-1">{nameError}</p>
              )}
            </div>
          </div>

          {/* Description field */}
          <div className="flex items-start gap-4">
            <label className="w-32 text-sm text-slate-700 pt-2 flex-shrink-0">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Organization Roles */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-semibold text-slate-800">Organization Roles</h3>
            </div>
            <div className="border-t border-slate-200 pt-3">
              {/* Assigned roles list */}
              {roles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {roles.map((role, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                    >
                      {role}
                      <button
                        onClick={() => setRoles(roles.filter((_, i) => i !== idx))}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Icon name="XIcon" size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Role input inline */}
              {showRoleInput && (
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAssignRole(); if (e.key === 'Escape') setShowRoleInput(false); }}
                    placeholder="Enter role name..."
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={handleAssignRole}
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowRoleInput(false); setRoleInput(''); }}
                    className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Assign Role button */}
              {!showRoleInput && (
                <button
                  onClick={() => setShowRoleInput(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 border border-blue-400 rounded hover:bg-blue-50 transition-colors"
                >
                  <Icon name="PlusIcon" size={14} />
                  Assign Role
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 active:scale-95 transition-all"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-slate-600 text-sm font-medium rounded-full border border-slate-300 hover:bg-slate-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfigDataTableProps {
  columns: ConfigColumn[];
  rows: ConfigRow[];
  onAddRow: (data: { name: string; description: string; roles: string[] }) => void;
  addButtonLabel?: string;
  modalTitle?: string;
  nameLabel?: string;
}

export default function ConfigDataTable({
  columns,
  rows,
  onAddRow,
  addButtonLabel = 'Add New',
  modalTitle = 'New Entry',
  nameLabel = 'Name',
}: ConfigDataTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredRows = rows.filter((row) =>
    columns.some((col) =>
      String(row[col.field] ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSave = (data: { name: string; description: string; roles: string[] }) => {
    onAddRow(data);
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="relative">
          <Icon name="SearchIcon" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-56"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-sm"
        >
          <Icon name="PlusIcon" size={15} />
          {addButtonLabel}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  className="table-header-cell"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.header}
                </th>
              ))}
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Icon name="InboxIcon" size={32} className="text-slate-300" />
                    <p className="text-sm font-medium">No records found</p>
                    <p className="text-xs">Click &quot;{addButtonLabel}&quot; to add your first entry</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={row.id} className="table-row">
                  {columns.map((col) => (
                    <td key={col.field} className="table-cell">
                      {col.field === 'roles' && Array.isArray(row[col.field]) ? (
                        <div className="flex flex-wrap gap-1">
                          {(row[col.field] as string[]).map((r: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                              {r}
                            </span>
                          ))}
                          {(row[col.field] as string[]).length === 0 && (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </div>
                      ) : (
                        <span>{row[col.field] ?? '—'}</span>
                      )}
                    </td>
                  ))}
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-500 hover:text-blue-600">
                        <Icon name="EditIcon" size={14} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-50 transition-colors text-slate-500 hover:text-red-600">
                        <Icon name="TrashIcon" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRows.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500">
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredRows.length)}–{Math.min(currentPage * rowsPerPage, filteredRows.length)} of {filteredRows.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronLeftIcon" size={14} className="text-slate-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 text-xs rounded transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white font-medium' :'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronRightIcon" size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <AddModal
          title={modalTitle}
          nameLabel={nameLabel}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
