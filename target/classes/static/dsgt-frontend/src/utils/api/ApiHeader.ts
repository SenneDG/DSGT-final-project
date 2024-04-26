export const multipartFormData = { 'Content-Type': 'multipart/form-data' };
export const applicationMergePatchJson = {
  'Content-Type': 'application/merge-patch+json',
};
export const authentication = (token: string) => ({
  'Authorization': `Bearer ${token}`
});

export default {};
