
import React, { useState } from 'react';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onAdd, onDelete }) => {
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    onAdd(input);
    setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-navy-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 text-center">Ajanda & Hedefler</h3>
        <p className="text-sm text-slate-400 text-center mb-8 uppercase tracking-widest font-bold">Günlük Rutinini Yönet</p>

        <form onSubmit={handleAdd} className="flex space-x-2 mb-8">
          <input 
            type="text" placeholder="Yapılacak bir şey ekle..." 
            className="flex-1 p-5 bg-slate-50 dark:bg-navy-900 rounded-2xl border-none focus:ring-4 focus:ring-orange-100 dark:text-white"
            value={input} onChange={e => setInput(e.target.value)}
          />
          <button className="bg-orange-500 text-white px-8 rounded-2xl font-black shadow-lg shadow-orange-100 dark:shadow-none hover:bg-orange-600 transition-all">+</button>
        </form>

        <div className="space-y-3">
          {todos.map(t => (
            <div key={t.id} className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-900/30 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all">
              <button onClick={() => onToggle(t.id)} className="flex items-center space-x-4 flex-1">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${t.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200'}`}>
                  {t.completed && '✓'}
                </div>
                <span className={`font-bold ${t.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{t.text}</span>
              </button>
              <button onClick={() => onDelete(t.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">SİL</button>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="text-center py-12 text-slate-300 italic">Henüz hiç görev eklenmedi.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
