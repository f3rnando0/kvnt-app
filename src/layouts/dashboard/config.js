import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import SearchIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import LogoutIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon";
import { KeyIcon, UsersIcon, CubeTransparentIcon } from "@heroicons/react/24/solid";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Geral",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Consultar",
    path: "/search",
    icon: (
      <SvgIcon fontSize="small">
        <SearchIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Conta",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Configurações",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Sair",
    path: "/auth/login",
    icon: (
      <SvgIcon fontSize="small">
        <LogoutIcon />
      </SvgIcon>
    ),
  },
];

export const adminItems = [
  {
    title: "Geral",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Consultar",
    path: "/search",
    icon: (
      <SvgIcon fontSize="small">
        <SearchIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Conta",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Configurações",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Usuários",
    path: "/admin/users",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Keys",
    path: "/admin/keys",
    icon: (
      <SvgIcon fontSize="small">
        <KeyIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Sair",
    path: "/auth/login",
    icon: (
      <SvgIcon fontSize="small">
        <LogoutIcon />
      </SvgIcon>
    ),
  },
];

export const nosubItems = [
  {
    title: "Geral",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Consultar",
    path: "/search",
    icon: (
      <SvgIcon fontSize="small">
        <SearchIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Planos",
    path: "/plans",
    icon: (
      <SvgIcon fontSize="small">
        <CubeTransparentIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Conta",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Configurações",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Sair",
    path: "/auth/login",
    icon: (
      <SvgIcon fontSize="small">
        <LogoutIcon />
      </SvgIcon>
    ),
  },
];