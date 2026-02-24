import { Component } from 'react';
import { Button, Result } from 'antd';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Result
            status="error"
            title="Something went wrong"
            subTitle="Please try refreshing the page."
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
