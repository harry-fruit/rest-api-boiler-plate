export const Server = jest.fn().mockImplementation(() => {
  return {
    run: jest.fn(),
  };
});