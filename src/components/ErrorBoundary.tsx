import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorMsg = error?.message || String(error);
    // Ignore benign extension connection errors
    if (
      errorMsg.toLowerCase().includes('metamask') ||
      errorMsg.toLowerCase().includes('failed to connect to metamask')
    ) {
      console.warn('[ErrorBoundary] Handled extension rejection gracefully:', errorMsg);
      this.setState({ hasError: false, error: null });
      return;
    }

    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'An unexpected error occurred';
      const isMetaMask =
        errorMsg.toLowerCase().includes('metamask') ||
        errorMsg.toLowerCase().includes('failed to connect to metamask');

      return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-base font-bold text-neutral-100">
                {isMetaMask ? 'MetaMask Connection Notice' : 'Something went wrong'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {isMetaMask
                  ? 'Your browser extension could not establish an RPC handshake in this sandboxed window. The app has safeguarded your data.'
                  : 'An interface error was caught. You can reload the application safely.'}
              </p>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 block font-mono">Error Details</span>
              <p className="text-xs text-neutral-300 font-mono mt-0.5 truncate">{errorMsg}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
