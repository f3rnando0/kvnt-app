import { TextField } from "@mui/material";
import { Stack } from "@mui/system";

export const UsersSearch = (props) => {
  const { useSearch = () => {} } = props;

  const SetSearch = (value) => {
    useSearch(value);
  };

  const HandleInputChange = (event) => {
    event.preventDefault();

    const target = event.target;
    const value = target.value;

    SetSearch(value);
  };

  return (
    <>
      <Stack sx={{ gap: 2, flexDirection: "row", alignItems: "center" }}>
        <TextField
          fullWidth
          size="small"
          id="search"
          placeholder="Pesquisa pelo id do usuário"
          onChange={HandleInputChange}
          sx={{ maxWidth: 500 }}
        />
      </Stack>
    </>
  );
};
