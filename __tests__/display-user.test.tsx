import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { User } from "@supabase/supabase-js";
import { UserContext } from "@/app/context-provider";
import DisplayUser from "@/components/display-user";
import { randomUUID } from "crypto";

jest.mock("@/utils/supabase/client", () =>
  require("@/__mocks__/supabase-client")
);

describe("DisplayUser Component", () => {
  it('renders "Not logged in" when no user is provided', () => {
    render(
      <UserContext.Provider value={{ user: null }}>
        <DisplayUser />
      </UserContext.Provider>
    );

    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });

  it("renders the user email when an user is logged in", () => {
    const partialMockUser: Partial<User> = {
      email: "test@domeen.ee",
    };

    const mockUser: User = {
      ...partialMockUser,
      id: partialMockUser.id ?? randomUUID(),
      //email: partialMockUser.email ?? "mockuser@mockdomain.com",
      app_metadata: partialMockUser.app_metadata ?? {},
      user_metadata: partialMockUser.user_metadata ?? {},
      aud: partialMockUser.aud ?? "authenticated",
      created_at: partialMockUser.created_at ?? new Date().toISOString(),
    } as User;

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <DisplayUser />
      </UserContext.Provider>
    );

    expect(screen.getByText(/logged in as/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email!)).toBeInTheDocument();
  });
});
