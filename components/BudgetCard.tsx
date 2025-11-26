
import React, { useMemo } from 'react';
import { BudgetCategory } from '../types';
import { AlertCircle } from 'lucide-react';

interface BudgetCardProps {
  category: BudgetCategory;
  onSelect: (id: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ category, onSelect }) => {
  const percentage = useMemo(() => {
    if (category.allocated === 0) return 0;
    return Math.min(100, (category.spent / category.allocated) * 100);
  }, [category.allocated, category.spent]);

  const remaining = category.allocated - category.spent;
  const isOverBudget = remaining < 0;

  return (
    <div 
      onClick={() => onSelect(category.id)}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] flex flex-col justify-between h-full"
      style={{ borderTop: `4px solid ${category.color}` }}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
             <div className="text-2xl">{category.icon}</div>
             <div>
                <h3 className="text-xl font-bold text-slate-800">{category.name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{category.type}</p>
             </div>
          </div>
        </div>
        
        {category.description && (
          <p className="text-sm text-slate-500 mt-2 mb-4 line-clamp-2">{category.description}</p>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-2">
           <span className={`text-3xl font-bold ${isOverBudget ? 'text-red-500' : 'text-slate-800'}`}>
            ${remaining.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 mb-1">
            of ${category.allocated.toLocaleString()}
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: isOverBudget ? '#ef4444' : category.color 
            }}
          />
        </div>
        
        {isOverBudget && (
          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs font-medium">
            <AlertCircle size={12} />
            <span>Over limit</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;
