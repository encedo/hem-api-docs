import React, {type ReactNode} from 'react';

/** `true` = allowed, `false` = not allowed, string = allowed with a remark. */
export type RoleValue = boolean | string;

export type RolesProps = {
  user?: RoleValue;
  master?: RoleValue;
  ext?: RoleValue;
};

const LABELS: Array<[keyof RolesProps, string]> = [
  ['user', 'User'],
  ['master', 'Master'],
  ['ext', 'ExtAuth'],
];

function Pill({label, value}: {label: string; value: RoleValue}): ReactNode {
  const allowed = value !== false;
  const text = typeof value === 'string' ? value : allowed ? 'Allowed' : 'Not allowed';
  return (
    <span className={`api-role ${allowed ? 'api-role--allowed' : 'api-role--denied'}`} title={text}>
      <span className="api-role__name">{label}</span>
      <span className="api-role__value">{typeof value === 'string' ? value : allowed ? '✓' : '✗'}</span>
    </span>
  );
}

/** "Allowed users" row: which roles may call the endpoints on this page. */
export default function Roles({user = false, master = false, ext = false}: RolesProps): ReactNode {
  const values: RolesProps = {user, master, ext};
  return (
    <div className="api-meta api-roles">
      <span className="api-meta__label">Allowed users</span>
      {LABELS.map(([key, label]) => (
        <Pill key={key} label={label} value={values[key] ?? false} />
      ))}
    </div>
  );
}
