import Head from "next/head";
import { Container, tableCellClasses, styled, Select, MenuItem, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  SvgIcon,
} from "@mui/material";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { Scrollbar } from "src/components/scrollbar.js";
import { useState } from "react";
import Link from "next/link.js";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEEFE",
    color: "indigo",
  },
}));

const Page = () => {
  const [planType, setPlanType] = useState("Mensal");

  const handlePlanTypeChange = (e) => {
    switch (e.target.value) {
      case "Mensal":
        setPlanType("Mensal");
        return;
      case "Semanal":
        setPlanType("Semanal");
        return;
      case "Trimestral":
        setPlanType("Trimestral");
        return;
      case "Lifetime":
        setPlanType("Lifetime");
        return;
      default:
        setPlanType("Mensal");
        return;
    }
  };

  return (
    <>
      <Head>
        <title>Plans | Kvnt</title>
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
            <div>
              <Typography variant="h4">Planos</Typography>
              <Select
                id="api"
                name="api"
                sx={{ width: "120px", height: "50px", mt: "20px" }}
                onChange={(e) => handlePlanTypeChange(e)}
                value={planType}
              >
                <MenuItem value={"Semanal"}>Semanal</MenuItem>
                <MenuItem value={"Mensal"}>Mensal</MenuItem>
                <MenuItem value={"Trimestral"}>Trimestral</MenuItem>
                <MenuItem value={"Lifetime"}>Lifetime</MenuItem>
              </Select>
            </div>
          </Stack>
          <Card sx={{ mt: "20px" }}>
            <Scrollbar>
              <Box sx={{ minWidth: 300 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "left" }}>
                        <Typography variant="h6" color="indigo">
                          BASIC
                        </Typography>
                        {planType === "Mensal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$25,00
                          </Typography>
                        )}
                        {planType === "Semanal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$10,00
                          </Typography>
                        )}
                        {planType === "Trimestral" && (
                          <Typography variant="h6" color="neutral.900">
                            R$70,00
                          </Typography>
                        )}
                        {planType === "Lifetime" && (
                          <Typography variant="h6" color="neutral.900">
                            R$299,00
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h6" color="indigo">
                          STANDART
                        </Typography>
                        {planType === "Mensal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$50,00
                          </Typography>
                        )}
                        {planType === "Semanal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$25,00
                          </Typography>
                        )}
                        {planType === "Trimestral" && (
                          <Typography variant="h6" color="neutral.900">
                            R$135,00
                          </Typography>
                        )}
                        {planType === "Lifetime" && (
                          <Typography variant="h6" color="neutral.900">
                            R$499,00
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h6" color="indigo">
                          VIP
                        </Typography>
                        {planType === "Mensal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$99,00
                          </Typography>
                        )}
                        {planType === "Semanal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$55,00
                          </Typography>
                        )}
                        {planType === "Trimestral" && (
                          <Typography variant="h6" color="neutral.900">
                            R$269,00
                          </Typography>
                        )}
                        {planType === "Lifetime" && (
                          <Typography variant="h6" color="neutral.900">
                            R$990,00
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h6" color="indigo">
                          ELITE
                        </Typography>
                        {planType === "Mensal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$170,00
                          </Typography>
                        )}
                        {planType === "Semanal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$80,00
                          </Typography>
                        )}
                        {planType === "Trimestral" && (
                          <Typography variant="h6" color="neutral.900">
                            R$400,00
                          </Typography>
                        )}
                        {planType === "Lifetime" && (
                          <Typography variant="h6" color="neutral.900">
                            R$1.399,00
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h6" color="indigo">
                          ULTRA
                        </Typography>
                        {planType === "Mensal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$240,00
                          </Typography>
                        )}
                        {planType === "Semanal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$150,00
                          </Typography>
                        )}
                        {planType === "Trimestral" && (
                          <Typography variant="h6" color="neutral.900">
                            R$650,00
                          </Typography>
                        )}
                        {planType === "Lifetime" && (
                          <Typography variant="h6" color="neutral.900">
                            R$2.399,00
                          </Typography>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="h6" color="indigo">
                          MAXIMUM
                        </Typography>
                        {planType === "Mensal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$520,00
                          </Typography>
                        )}
                        {planType === "Semanal" && (
                          <Typography variant="h6" color="neutral.900">
                            R$300,00
                          </Typography>
                        )}
                        {planType === "Trimestral" && (
                          <Typography variant="h6" color="neutral.900">
                            R$1.000,00
                          </Typography>
                        )}
                        {planType === "Lifetime" && (
                          <Typography variant="h6" color="neutral.900">
                            R$5.000,00
                          </Typography>
                        )}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover key="TEST">
                      <TableCell align="left">
                        <Typography fontSize="small">Consultas diárias</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" fontWeight="bold">
                          50
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" fontWeight="bold" sx={{ pl: "15px" }}>
                          100
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" fontWeight="bold">
                          200
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" fontWeight="bold">
                          400
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" fontWeight="bold">
                          600
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" fontWeight="bold" sx={{ pl: "15px" }}>
                          1000
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow hover key="TEST2">
                      <TableCell align="left">
                        <Typography fontSize="small">Acesso a todas as {`API's`}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "neutral.900",
                            }}
                          >
                            <XMarkIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" sx={{ pl: "15px" }}>
                          <SvgIcon
                            sx={{
                              color: "neutral.900",
                            }}
                          >
                            <XMarkIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "neutral.900",
                            }}
                          >
                            <XMarkIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "indigo",
                            }}
                          >
                            <CheckCircleIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "indigo",
                            }}
                          >
                            <CheckCircleIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" sx={{ pl: "15px" }}>
                          <SvgIcon
                            sx={{
                              color: "indigo",
                            }}
                          >
                            <CheckCircleIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow hover key="test3">
                      <TableCell align="left">
                        <Typography fontSize="small">Acesso a novas funcionalidade</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "neutral.900",
                            }}
                          >
                            <XMarkIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" sx={{ pl: "15px" }}>
                          <SvgIcon
                            sx={{
                              color: "neutral.900",
                            }}
                          >
                            <XMarkIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "neutral.900",
                            }}
                          >
                            <XMarkIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "neutral.900",
                            }}
                          >
                            <XMarkIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small">
                          <SvgIcon
                            sx={{
                              color: "indigo",
                            }}
                          >
                            <CheckCircleIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize="small" sx={{ pl: "15px" }}>
                          <SvgIcon
                            sx={{
                              color: "indigo",
                            }}
                          >
                            <CheckCircleIcon />
                          </SvgIcon>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Scrollbar>
            <Link
              href="https://t.me/pe0plearedisgusting"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="contained"
                sx={{ height: "60px", width: "120px", mt: "20px", ml: "10px" }}
              >
                Comprar
              </Button>
            </Link>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
