import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    width: 500,
    height: 400
  },
}));

export default function PaperSheet() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" component="h3">
        <b>User Profile Information</b>
      </Typography>
      <Typography component="p">
        Include information about user here. (Try to at least get user name, profile pic and list of playlists the have maybe?)
      </Typography>
    </Paper>
  );
}