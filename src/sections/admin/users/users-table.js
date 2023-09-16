import PropTypes from "prop-types";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Tooltip,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { XCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router.js";
import { api } from "src/api/api.js";
import { useAuth } from "src/hooks/use-auth.js";

export const UsersTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    results = [],
    setAllUsers = () => {},
    allUsers = [],
  } = props;

  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleBan = async (id) => {
    if (!id) return;

    if (user !== null && !user.isAdmin) {
      router.push("/404");
    }

    try {
      const req = await api.delete(`/users?id=${id}`);

      if (!req.data) return;

      let newArray = [...allUsers];
      newArray = newArray.filter((item) =>
        item._id === id ? (item.banned = true) : (item.banned = item.banned)
      );

      setAllUsers(newArray);
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        api
          .post("/auth/refresh")
          .then(async (data) => {
            if (!data.data) {
              signOut();
            }
            if (data.status === 200) {
              const req = await api.delete(`/users?id=${id}`);

              if (!req.data) return;
              let newArray = [...allUsers];
              newArray = newArray.filter((item) =>
                item._id === id ? (item.banned = true) : (item.banned = item.banned)
              );

              allUsers(newArray);
            }
          })
          .catch((error) => {
            if (error.message === "Request failed with status code 404") {
              if (error.response.data.message === "Refresh Token não encontrado.") {
                signOut();
              }
            }

            return;
          });
      } else if (error.message === "Request failed with status code 400") {
        return;
      }
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NOME</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>CLIENTE</TableCell>
                <TableCell>EXPIROU</TableCell>
                <TableCell>BANIDO</TableCell>
                <TableCell>CONSULTAS</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((user) => {
                return (
                  <TableRow hover key={user._id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{user.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.subscribed ? "Sim" : "Não"}</TableCell>
                    <TableCell>
                      {!user.subscribed && user.subscriptionKey ? "Sim" : "Não"}
                    </TableCell>
                    <TableCell>{user.banned ? "Sim" : "Não"}</TableCell>
                    <TableCell>{user.consultas.length}</TableCell>
                    <TableCell>
                      <Tooltip title="Banir">
                        <SvgIcon
                          fontSize="medium"
                          sx={{
                            color: "error.main",
                            cursor: "pointer",
                            "&:hover": {
                              color: "error.dark",
                            },
                            ml: "2px",
                          }}
                          onClick={() => handleBan(user._id)}
                        >
                          <XCircleIcon />
                        </SvgIcon>
                      </Tooltip>
                      <Tooltip title="Copiar">
                        <SvgIcon
                          fontSize="medium"
                          sx={{
                            color: "neutral.500",
                            cursor: "pointer",
                            "&:hover": {
                              color: "primary.main",
                            },
                            ml: "2px",
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `NOME: ${user.name}, EMAIL: ${user.email}, ID: ${
                                user._id
                              }, CLIENTE: ${user.subscribed ? "Sim" : "Não"}, PLANO EXPIROU: ${
                                !user.subscribed && user.subscriptionKey ? "Sim" : "Não"
                              }, BANIDO: ${user.banned ? "Sim" : "Não"}, CONSULTAS: ${
                                user.consultas.length
                              }`
                            );
                          }}
                        >
                          <DocumentDuplicateIcon />
                        </SvgIcon>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  setKeys: PropTypes.array,
};
