import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, Stack, Typography, styled, useMediaQuery } from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { items, adminItems, nosubItems } from "./config";
import { SideNavItem } from "./side-nav-item";
import { useAuth } from "src/hooks/use-auth.js";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const { user } = useAuth();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: "inline-flex",
              height: 100,
              width: "100%",
              textDecoration: "none",
              flexDirection: "column",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h2" color="indigo" fontWeight="700" sx={{ fontFamily: "'Barlow', sans-serif;", fontSize: "2.50rem"}}>
              KVNT
            </Typography>
            <Typography
              variant="h2"
              color="white"
              sx={{ fontFamily: "'Barlow', sans-serif;", fontSize: "2.50rem"}}
            >
              SEARCH.
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Logado como
          </Typography>
          {user !== null && <Typography variant="overline">{user.name}</Typography>}
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {user !== null &&
              !user.isAdmin &&
              user.subscribed === true &&
              items.map((item) => {
                const active = item.path ? pathname === item.path : false;

                return (
                  <SideNavItem
                    active={active}
                    disabled={item.disabled}
                    external={item.external}
                    icon={item.icon}
                    key={item.title}
                    path={item.path}
                    title={item.title}
                    isLogout={item.path === "/auth/login"}
                  />
                );
              })}

            {user !== null &&
              !user.isAdmin &&
              user.subscribed === false &&
              nosubItems.map((item) => {
                const active = item.path ? pathname === item.path : false;

                return (
                  <SideNavItem
                    active={active}
                    disabled={item.disabled}
                    external={item.external}
                    icon={item.icon}
                    key={item.title}
                    path={item.path}
                    title={item.title}
                    isLogout={item.path === "/auth/login"}
                  />
                );
              })}
            {user !== null &&
              user.isAdmin &&
              adminItems.map((item) => {
                const active = item.path ? pathname === item.path : false;

                return (
                  <SideNavItem
                    active={active}
                    disabled={item.disabled}
                    external={item.external}
                    icon={item.icon}
                    key={item.title}
                    path={item.path}
                    title={item.title}
                    isLogout={item.path === "/auth/login"}
                  />
                );
              })}
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
