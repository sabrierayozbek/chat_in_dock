import React from "react";
import firebase from "../../firebase"; //kullanıcı için işlemler olacağı için firebase'in bütün gerekliliklerini eklediğimiz dosyayı import ederek kullanmalıyız.
import md5 from "md5"; //hash kodları için, herbir kullanıcıya atılacak unique number'larda kullanılacak.
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react"; //Register formu için kullanacağımız bileşenler. 
import { Link } from "react-router-dom"; //Kullanıcıyı register ekranından başka bir ekreana yönlendirmek için kullanacağım kütüphane.

//React bileşen sınıfı oluşturmak için, sınıfınızı React.Component‘ten türetmemiz gerekir:

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false, //buton üzerindeki loading butonu için.
    usersRef: firebase.database().ref("users") //oluşturulan kullanıcların spesifik id'lerinin toplanacağı değişken.
  };


  //bu form ile ilgili fonksiyonda form ile ilgili eylemlerimi kontrol edeceğim.

  isFormValid = () => { 
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Lütfen bütün alanları doldurunuz." };
      this.setState({ errors: errors.concat(error) }); //false ise işlenecek state.
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Girdiğiniz şifre yanlış." }; //false ise işlenecek state.
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => { //kullanıcı formu boş bırakmışsa, belirttiğim alanların kontrolünü yaparak eylemlerler gerçekleştirecek.
    return ( //uzunlukları sıfırsa hiç kimse değer girmemiş demektir.
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false; //yukarıdaki state'leri tetikler.
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors => //hatalarımızı ekrana basmak için gerekli olan fonkisyonumuz.
    errors.map((error, i) => <p key={i}>{error.message}</p>); //Hatayı map ve element key ile formun altında görüntelemek için işlem yaptık.

//formumuza  fonksiyonellik eklemek için her inputtaki onchange aksiyonlarına etki etmeliyiz.

  handleChange = event => { //formumuza girilecek değerler üstte tanımladığımız değişkenleri verilerle dolduracak.
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => { //aynı zamanda metodumuzu çağırmak için bu metodumuzu oluşturuyruz.
    event.preventDefault(); //formu yolladığımızda reload edilene kadar gerçekleşecek her olay. 
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true }); //firebase'e ulaşmadan önce hataları bir temizliyoruz.
      firebase
        .auth() //bütün authorizationnpm işlemlerini yapmak için oluşturduğumuz bir fonksiyon.
        .createUserWithEmailAndPassword(this.state.email, this.state.password) //kullanıcıya yaratmak için gerçekleştirebileceğim olayları yazarak başlayacağım statement. bu statement'da bir cretead user değişkenim olacak. bunları firebase'de depolayacağm.
        .then(createdUser => { 
          console.log(createdUser);
          createdUser.user 
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5( //her kullanıcıya gravatar tarafından rastgele bir avatar atanıyor.
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log("kullanıcı kaydedildi.");
              });
            })
            .catch(err => { //bir hata durumunda algılayıp hatayı yakalamak.
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => { //bir hata durumunda algılayıp hatayı yakalamak.
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  saveUser = createdUser => { //kullanıcıyı veritabanını kaydedeceğiz, burada kullanıcıya ait unique bir numara ve unique avatarı olacak.
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

      /* React.Component‘ten türetilen sınıflarda, zorunlu olarak tanımlamanız gereken metot sadece render()‘dır. */


  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="universal access" color="orange" />
            ┌( ಠ_ಠ)┘ Sohbete katılmak için kayıt ol! ┌( ಠ_ಠ)┘
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Kullanıcı Adı"
                onChange={this.handleChange} //bir input olduğunda onchange fonksiyonu gerçeklenir. yukarıda fonksiyonunu hayata geçirdim.
                value={username}
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Adresi"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, "email")} //handle input error state'ini tetikleyecek.
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

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Şifre Doğrulama"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputError(errors, "password")}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
                Gönder
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && ( //errors array değişkenimizin içinde eleman varsa hata vardır. bunu tetikleyip hatayı ekrana basıyoruz.
            <Message error>
              <h3>Hata</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Zaten kullanıcı mısınız? <Link to="/login">Giriş formuna dön.</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
