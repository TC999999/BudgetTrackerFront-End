import { describe, it, expect } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import AuthProgressHeader from "./AuthProgressHeader";

describe("Header for Authorization Progress Bar", () => {
  it("should render without crashing", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="beginning"
        current={false}
        done={false}
        label="Account Information"
      />
    );
  });

  it("should contain correct label", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="beginning"
        current={false}
        done={false}
        label="Account Information"
      />
    );

    expect(screen.queryByText("Account Information")).toBeInTheDocument();
  });

  it("should have correct class for beginning header", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="beginning"
        current={false}
        done={false}
        label="Account Information"
      />
    );

    expect(screen.getByTitle("auth-progress-header")).toHaveClass(
      "rounded-l-sm"
    );
    expect(screen.getByTitle("auth-progress-header")).not.toHaveClass(
      "rounded-r-sm"
    );
  });

  it("should have correct class for ending header", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="end"
        current={false}
        done={false}
        label="Account Information"
      />
    );

    expect(screen.getByTitle("auth-progress-header")).not.toHaveClass(
      "rounded-l-sm"
    );
    expect(screen.getByTitle("auth-progress-header")).toHaveClass(
      "rounded-r-sm"
    );
  });

  it("should have correct class for middle header", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="middle"
        current={false}
        done={false}
        label="Account Information"
      />
    );

    expect(screen.getByTitle("auth-progress-header")).not.toHaveClass(
      "rounded-l-sm"
    );
    expect(screen.getByTitle("auth-progress-header")).not.toHaveClass(
      "rounded-r-sm"
    );
  });

  it("should have correct class if header is current step", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="middle"
        current={true}
        done={false}
        label="Account Information"
      />
    );

    expect(screen.getByTitle("auth-progress-header")).toHaveClass(
      "underline text-green-500 bg-green-100"
    );
  });

  it("should have correct class if header is not current step", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="middle"
        current={false}
        done={false}
        label="Account Information"
      />
    );

    expect(screen.getByTitle("auth-progress-header")).not.toHaveClass(
      "underline text-green-500 bg-green-100"
    );
  });

  it("should have correct class if header is completed step", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="middle"
        current={false}
        done={true}
        label="Account Information"
      />
    );

    expect(screen.getByTitle("auth-progress-header")).toHaveClass(
      "text-green-700 bg-green-500"
    );
  });

  it("should have correct class if header is not completed step", () => {
    renderWithRedux(
      <AuthProgressHeader
        place="middle"
        current={false}
        done={false}
        label="Account Information"
      />
    );

    expect(screen.getByTitle("auth-progress-header")).not.toHaveClass(
      "text-green-700 bg-green-500"
    );
  });
});
