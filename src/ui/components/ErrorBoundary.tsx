import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
          <div className="text-center max-w-md">
            <h1 className="text-xl font-bold text-red-500 mb-2">
              Something went wrong
            </h1>
            <p className="text-zinc-400 mb-4">
              {this.state.error.message}
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
