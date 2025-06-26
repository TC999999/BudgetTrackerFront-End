import { describe, it, expect, beforeAll } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import AuthProgress from "./AuthProgress";
import { StepCompleted } from "../interfaces/authInterfaces";
import { stepList } from "../interfaces/registerInterfaces";

describe("Custom Progress Bar for Registration Process", () => {
  let stepCompleted: StepCompleted;

  let stepList: stepList;

  beforeAll(() => {
    stepCompleted = {
      userInfo: false,
      oneTimeCode: false,
      newPassword: false,
      success: false,
    };

    stepList = {
      showSensitiveForm: false,
      showOTPForm: false,
      showAdditionalForm: false,
    };
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <AuthProgress
        type="register"
        stepList={stepList}
        currentStep="showSensitiveForm"
        currentProgress={33}
      />
    );
  });

  it("should have 3 headers for register progress bar", () => {
    renderWithRedux(
      <AuthProgress
        type="register"
        stepList={stepList}
        currentStep="showSensitiveForm"
        currentProgress={33}
      />
    );

    expect(screen.getAllByTitle("auth-progress-header")).toHaveLength(3);
  });

  it("should have 4 headers for password reset progress bar", () => {
    renderWithRedux(
      <AuthProgress
        type="resetPassword"
        stepList={stepCompleted}
        currentStep="userInfo"
        currentProgress={25}
      />
    );

    expect(screen.getAllByTitle("auth-progress-header")).toHaveLength(4);
  });
});
