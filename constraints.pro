% Inspired by https://github.com/babel/babel/blob/main/constraints.pro
% https://yarnpkg.com/features/constraints

% Enforces the license
gen_enforced_field(WorkspaceCwd, 'license', 'MIT') :-
  workspace_field(WorkspaceCwd, 'private', true).

% Enforces that a dependency doesn't appear in both `dependencies` and `devDependencies`
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, null, 'devDependencies') :-
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, 'devDependencies'),
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, 'dependencies').