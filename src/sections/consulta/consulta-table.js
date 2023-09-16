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
  SvgIcon,
  Link,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import CopyIcon from "@heroicons/react/24/solid/ClipboardDocumentIcon";
import { randomUUID } from "crypto";

export const ConsultaTable = (props) => {
  const {
    count = 0,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    results = []
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Domínio</TableCell>
                <TableCell>Login</TableCell>
                <TableCell>Copiar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((customer) => {
                return (
                  <TableRow hover 
                  key={() => randomUUID()}>
                    <TableCell>
                      <Stack alignItems="center" 
                      direction="row"
                      spacing={2}>
                        <Typography variant="subtitle2"><Link href={customer.url} 
                        color="inherit"
                        target="_blank"
                        rel="noopener noreferrer">{customer.url}</Link></Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{`${customer.username}:${customer.password}`}</TableCell>
                    <TableCell sx={{ textAlign: "initial"}}>
                      <SvgIcon
                        fontSize="medium"
                        sx={{
                          color: "neutral.500",
                          cursor: "pointer",
                          '&:hover': {
                            color: 'primary.main'
                          },
                          ml: '12px'
                        }}
                        titleAccess='Copiar'
                        onClick={() => {navigator.clipboard.writeText(`${customer.username}:${customer.password}`)}}
                      >
                        <CopyIcon />
                      </SvgIcon>
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

ConsultaTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
