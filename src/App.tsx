import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { TextField, FormHelperText, Button, createStyles, Theme } from '@material-ui/core';
import * as validator from 'validator';
import { FormValidationRules, MessageType, validateForm, initForm } from 'ts-form-validation';
import Paper from '@material-ui/core/Paper';
import { TextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Form } from 'ts-form-validation';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing.unit,
      width: 400,
      margin: 16,
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    json: {
      flex: 1,
    },
  });

interface RegisterForm {
  displayName: string;
  email: string;
  password1: string;
  password2: string;
  photoURL?: string;
}

/**
 * Rules used in actual field validation
 */
const rules: FormValidationRules<RegisterForm> = {
  fields: {
    displayName: {
      required: true,
      trim: true,
      validate: (value: string) =>
        !validator.isLength(value, { min: 5, max: 30 }) && {
          type: MessageType.ERROR,
          message: 'Display name must be between 5 to 30 characters in length.',
        },
    },
    email: {
      required: true,
      trim: true,
      validate: (value: string) =>
        !validator.isEmail(value) && {
          type: MessageType.ERROR,
          message: 'Please give a valid email address',
        },
    },
    password1: {
      required: true,
      trim: true,
    },
    password2: {
      required: true,
      trim: true,
    },
  },
  validateForm: form => {
    const messages = {};

    // Do not make checking if user has not yet filled both fiel
    if (form.filled.password1 && form.filled.password2 && form.values.password1 !== form.values.password2) {
      return {
        ...form,
        messages,
        formMessage: {
          type: MessageType.ERROR,
          message: 'Password do not match',
        },
      };
    }
    return { ...form, messages };
  },
};

interface State {
  form: Form<RegisterForm>;
}

export declare function keys<T extends object>(): Array<keyof T>;

class App extends React.Component<any, State> {
  public state: State = {
    // Initialize form
    form: initForm<RegisterForm>(
      {
        displayName: '',
        email: '',
        password1: '',
        password2: '',
        photoURL: '',
      },
      rules,
    ),
  };

  public render() {
    const { classes } = this.props;
    const { formMessage, isFormValid } = this.state.form;

    return (
      <div className={classes.row}>
        <Paper className={classes.container}>
          <Typography variant="h3" gutterBottom>
            Register form example
          </Typography>
          {formMessage && (
            <FormHelperText error={formMessage.type === MessageType.ERROR}>{formMessage.message}</FormHelperText>
          )}
          {this.renderField('displayName', 'Display name')}
          {this.renderField('email', 'Email')}
          {this.renderField('password1', 'Password', { type: 'password' })}
          {this.renderField('password2', 'Password again', { type: 'password' })}

          <Button
            color="primary"
            variant="contained"
            disabled={!isFormValid}
            onClick={() => alert('Form ready to go!')}
          >
            Register
          </Button>
        </Paper>
        <div className={classes.json}>
          <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
        </div>
      </div>
    );
  }

  /**
   * Render a single form input field with all spices
   *
   * @private
   * @memberof App
   */
  private renderField = (key: keyof RegisterForm, label: string, props?: Partial<TextFieldProps>) => {
    const { classes } = this.props;

    const {
      values,
      messages: { [key]: message },
    } = this.state.form;
    return (
      <>
        <TextField
          {...props}
          id={key}
          label={label}
          className={classes.textField}
          value={values[key]}
          onBlur={this.handleBlur(key)}
          onChange={this.handleChange(key)}
          margin="normal"
          variant="outlined"
        />
        {message && <FormHelperText error={message.type === MessageType.ERROR}>{message.message}</FormHelperText>}
      </>
    );
  };

  private handleChange = (key: keyof RegisterForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const values = {
      ...this.state.form.values,
      [key]: event.target.value,
    };

    const form = validateForm(
      {
        ...this.state.form,
        values,
      },
      {
        // Disable preprocess while validating when writing
        usePreprocessor: false,
      },
    );

    this.setState({
      form,
    });
  };

  private handleBlur = (key: keyof RegisterForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // set field filled after blur, means that the field as been set once
    let form = { ...this.state.form };
    const filled = {
      ...form.filled,
      [key]: true,
    };

    form = validateForm({
      ...this.state.form,
      filled,
    });

    this.setState({
      form,
    });
  };
}

export default withStyles(styles, { withTheme: true })(App);
