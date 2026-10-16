import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class DisqusErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Error initializing forum embed.' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[Disqus ErrorBoundary] Caught forum embed issue:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-700 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="font-display font-extrabold text-lg text-slate-900">
            Disqus Forum Loading in Sandboxed Environment
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Third-party forum cookies or scripts may be sandboxed in this preview iframe.
            You can still interact with the community topics above.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading Forum</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
