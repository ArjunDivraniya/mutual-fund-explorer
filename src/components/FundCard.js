// src/components/FundCard.js
import Link from "next/link";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export function FundCard({ scheme }) {
  return (
    <Link href={`/funds/scheme/${scheme.schemeCode}`} passHref>
      <Card elevation={2} sx={{ height: "100%", transition: "transform .2s", '&:hover': { transform: 'translateY(-2px)' } }}>
        <CardActionArea sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {scheme.schemeName}
            </Typography>
            {scheme.fundHouse ? (
              <Typography variant="body2" color="text.secondary">
                {scheme.fundHouse}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                View details <ArrowForwardIcon fontSize="inherit" />
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}