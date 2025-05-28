import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import { UserInfoInterface } from "../interfaces/userInterfaces";
import UserCard from "./UserCard";

describe("User Dashboard Card", () => {
  let u: UserInfoInterface;
  let show: Mock;

  beforeAll(() => {
    u = { _id: "1", username: "testUser", totalAssets: 1000 };
    show = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<UserCard user={u} showForm={show} />);
  });

  it("should show user's username and correct conversion of total savings value", () => {
    renderWithReduxTestStore(<UserCard user={u} showForm={show} />);
    expect(screen.queryByText("testUser")).toBeInTheDocument();
    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();
  });

  it("should contain button to show transaction form", () => {
    renderWithReduxTestStore(<UserCard user={u} showForm={show} />);
    let button = screen.getByRole("button", { name: "Document a Transaction" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(show).toHaveBeenCalled();
  });

  it("should contain a button to redirect user to edit profile page", () => {
    let nav = vi.fn();
    renderWithReduxTestStore(<UserCard user={u} showForm={show} nav={nav} />);
    let button = screen.getByRole("button", { name: "Edit Profile" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(nav).toHaveBeenCalled();
  });
});
