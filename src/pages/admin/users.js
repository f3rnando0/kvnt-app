import Head from "next/head";
import { Box, Container, LinearProgress, Stack, Typography } from "@mui/material";
import { UsersSearch } from "src/sections/admin/users/users-search.js";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuth } from "src/hooks/use-auth.js";
import { useRouter } from "next/router.js";
import { UsersTable } from "src/sections/admin/users/users-table.js";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { applyPagination } from "src/utils/apply-pagination";
import { api } from "src/api/api.js";

const Page = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState([]);
  const [search, useSearch] = useState("");
  const [isAdmin, setAdmin] = useState();
  const initialValue = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = await api.get("/users/@me");

        if (req.data.isAdmin === false) {
          return setAdmin(false);
        } else if (req.data.isAdmin === true) {
          setAdmin(true);
        } else {
          return setAdmin(false);
        }
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          try {
            const req = api.post("/auth/refresh");

            if (req.status === 200) {
              const req = await api.get("/users/@me");

              if (req.data.isAdmin === false) {
                return setAdmin(false);
              } else if (req.data.isAdmin === true) {
                setAdmin(true);
              } else {
                return setAdmin(false);
              }
            }
          } catch (error) {
            if (error.message === "Request failed with status code 400") {
              if (error.response.data.message === "Refresh Token não encontrado.") {
                signOut();
              }
            }
          }
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isAdmin === true) {
      api
        .get("/users")
        .then((data) => {
          setAllUsers(data.data);
          initialValue.current = data.data;
        })
        .catch((error) => {
          if (error.message === "Request failed with status code 401") {
            api
              .post("/auth/refresh")
              .then((req) => {
                if (req.status === 200) {
                  api.get("/users").then((req) => {
                    setAllUsers(req.data);
                    initialValue.current = req.data;
                  });
                }
              })
              .catch((error) => {
                if (error.message === "Request failed with status code 400") {
                  if (error.response.data.message === "Refresh Token não encontrado.") {
                    signOut();
                  }
                }
              });
          }
        });
    }
  }, [isAdmin]);

  useEffect(() => {
    setAllUsers((allUsers) => {
      if (search === "") return initialValue.current;
      return allUsers.filter((user) => user._id.includes(search));
    });
  }, [search]);

  const useConsultasPagination = (data, page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(data, page, rowsPerPage);
    }, [data, page, rowsPerPage]);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const keys = useConsultasPagination(allUsers, page, rowsPerPage);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  if (isAdmin === undefined) {
    return (
      <LinearProgress />
    );
  }

  if (isAdmin === true) {
    return (
      <>
        <Head>
          <title>Users | Knvt</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Users</Typography>
                </Stack>
              </Stack>
              <UsersSearch
                setAllUsers={setAllUsers}
                allUsers={allUsers}
                search={search}
                useSearch={useSearch}
              />
              <UsersTable
                count={allUsers.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                results={keys}
                setKeys={setAllUsers}
                keys={allUsers}
              />
            </Stack>
          </Container>
        </Box>
      </>
    );
  }

  if (isAdmin === false) {
    router.push("/404");
  }
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
