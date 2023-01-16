import React from "react";
import { RiAlertLine } from "react-icons/ri";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.state = { error: "" };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  logErrorToMyService = (error, errorInfo) => {
    this.setState({ error: errorInfo });
    console.log(errorInfo);
  };

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h3 className="h4">
            {" "}
            <RiAlertLine /> Something went wrong.
          </h3>
          Try refreshing. <br />
          If persist, contact designer
          <details>
            <summary>For Developer: See more</summary>
            <p>
              <pre>{this.state.error.componentStack}</pre>
            </p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
