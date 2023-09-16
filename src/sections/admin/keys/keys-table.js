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

export const KeysTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    results = [],
    setKeys = () => {},
    keys = [],
  } = props;

  const router = useRouter();
  const { user, signOut } = useAuth();

  const renderKeyDuration = (param) => {
    switch (param) {
      case 1:
        return "7 dias";
      case 2:
        return "30 dias";
      case 3:
        return "90 dias";
      case 4:
        return "Nunca";
    }
  };

  const handleRevoke = async (key) => {
    if (!key) return;

    if (user !== null && !user.isAdmin) {
      router.push("/404");
    }

    try {
      const req = await api.delete(`/subscription?key=${key}`);

      if (!req.data) return;

      let newArray = [...keys];
      newArray = newArray.filter((item) => item._id !== key);

      setKeys(newArray);
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        api
          .post("/auth/refresh")
          .then(async (data) => {
            if (!data.data) {
              router.push("/");
            }
            if (data.status === 200) {
              const req = await api.delete(`/subscription?key=${key}`);

              if (!req.data.data) return;
              const newArray = keys.filter((item) => item._id === key);

              setKeys(newArray);
            }
          })
          .catch((error) => {
            if (error.message === "Request failed with status code 404") {
              if (error.response.data.message === "Refresh Token não encontrado.") {
                signOut()
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
                <TableCell>KEY</TableCell>
                <TableCell>PLANO</TableCell>
                <TableCell>DURAÇÃO</TableCell>
                <TableCell>USADA</TableCell>
                <TableCell>USADA POR</TableCell>
                <TableCell>EXPIROU</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((key) => {
                return (
                  <TableRow hover key={key._id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{key._id}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{renderKeyDuration(key.durationType)}</TableCell>
                    <TableCell>{key.planType.charAt(0).toUpperCase() + key.planType.slice(1)}</TableCell>
                    <TableCell>{key.used ? "Sim" : "Não"}</TableCell>
                    <TableCell>{key.usedBy}</TableCell>
                    <TableCell>{key.expired ? "Sim" : "Não"}</TableCell>
                    <TableCell>
                      <Tooltip title="Revogar">
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
                          onClick={() => handleRevoke(key._id)}
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
                            navigator.clipboard.writeText(`${key._id}`);
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

KeysTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  setKeys: PropTypes.array,
};
