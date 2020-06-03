import React from "react";
import firebase from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";


//React bileşen sınıfı oluşturmak için, sınıfınızı React.Component‘ten türetmemiz gerekir:

class Login extends React.Component {

    /* React.Component‘ten türetilen sınıflarda, zorunlu olarak tanımlamanız gereken metot sadece render()‘dır. */

  state = {
    email: "",
    password: "",
    errors: [],
    loading: false
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  render() { //render() metodu, bir sınıf bileşeni oluşturmak için gereken tek metottur.
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="chess knight" color="violet" />
            Sohbet Odamıza Giriş.
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Adresi"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, "email")}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Şifre"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="violet"
                fluid
                size="large"
              >
                Gönder
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Hata</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Kullanıcı hesabın yok mu? Hemen bize katıl! <Link to="/register">Kayıt Formuna Git</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
