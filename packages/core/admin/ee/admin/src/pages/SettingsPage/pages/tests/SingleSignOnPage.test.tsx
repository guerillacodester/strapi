import { useRBAC } from '@strapi/helper-plugin';
import { fireEvent, render, waitFor, screen } from '@tests/utils';

import { SingleSignOnPage } from '../SingleSignOnPage';

jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useRBAC: jest.fn(),
  useOverlayBlocker: jest.fn(() => ({ lockApp: jest.fn(), unlockApp: jest.fn() })),
  useFocusWhenNavigate: jest.fn(),
}));

describe('Admin | ee | SettingsPage | SSO', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and matches the snapshot', async () => {
    // @ts-expect-error – mocking
    useRBAC.mockImplementation(() => ({
      isLoading: false,
      allowedActions: { canUpdate: true, canReadRoles: true },
    }));
    const { queryByText } = render(<SingleSignOnPage />);

    await waitFor(() => expect(queryByText(/Loading/)).not.toBeInTheDocument());
    expect(
      await screen.findByText('Create new user on SSO login if no account exists')
    ).toBeInTheDocument();
  });

  it('should disable the form when there is no change', async () => {
    // @ts-expect-error – mocking
    useRBAC.mockImplementation(() => ({
      isLoading: false,
      allowedActions: { canUpdate: true, canReadRoles: true },
    }));
    const { queryByText } = render(<SingleSignOnPage />);

    await waitFor(() => expect(queryByText(/Loading/)).not.toBeInTheDocument());
    expect(
      await screen.findByText('Create new user on SSO login if no account exists')
    ).toBeInTheDocument();

    expect(screen.getByTestId('save-button')).toHaveAttribute('aria-disabled');
  });

  it('should not disable the form when there is a change', async () => {
    // @ts-expect-error – mocking
    useRBAC.mockImplementation(() => ({
      isLoading: false,
      allowedActions: { canUpdate: true, canReadRoles: true },
    }));

    render(<SingleSignOnPage />);
    const el = await screen.findByTestId('autoRegister');

    if (el) fireEvent.click(el);

    expect(await screen.findByTestId('save-button')).toBeEnabled();
  });
});
