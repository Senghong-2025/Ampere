export type  TPermissionAction = 'read' | 'write' | 'delete' | 'export' | 'import';

export interface IPermission {
  id: string;
  action: TPermissionAction;
  resource: string;
}