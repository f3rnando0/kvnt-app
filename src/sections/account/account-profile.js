import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import Avvvatars from "avvvatars-react";
import moment from "moment";
import { useAuth } from "src/hooks/use-auth.js";

export const AccountProfile = ({ user }) => {
  var expiresAt;
  if (user !== null && user.expiresAt !== null) {
    const expires = moment();
    expiresAt = expires.diff(user.expiresAt, "days");
  }
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avvvatars
            value={user.name}
            size={80}
            sx={{
              mb: 2,
            }}
          />
          <Typography gutterBottom variant="h5">
            {user.name}
          </Typography>
          {user !== null && user.subscribed && (
            <>
              <Typography color="text.secondary" variant="body2" fontWeight="bold">
                Plano
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user.subscriptionPlan === 'none' ? 'Nenhum' : user.subscriptionPlan.charAt(0).toUpperCase() + user.subscriptionPlan.slice(1)}
              </Typography>
            </>
          )}
          {user.subscribed && user.subscriptionPlan !== 'none' && (
            <Typography color="text.secondary" variant="body2" fontWeight="bold">
              Plano expira em
            </Typography>
          )}
          {user.subscribed === true && user.expiresAt && (
            <Typography color="text.secondary" variant="body2">
              {expiresAt * -1} dias
            </Typography>
          )}
          {user !== null && user.expiresAt === null && user.subscriptionPlan !== 'none' && (
            <Typography color="text.secondary" variant="body2">
              Nunca
            </Typography>
          )}
          {!user.subscribed && (
            <Typography color="text.secondary" variant="body2" fontWeight="bold">
              Nenhum plano ativo
            </Typography>
          )}
        </Box>
      </CardContent>
      <Divider />
    </Card>
  );
};
