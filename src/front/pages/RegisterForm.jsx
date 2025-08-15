import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/auth'

export const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isVisibleFirstPassword, setIsVisibleFirstPassword] = useState(true)
  const [validated, setValidated] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const navigate = useNavigate()

  const handleEmail = e => setEmail(e.target.value)
  const handlePassword = e => setPassword(e.target.value)
  const handleFirstName = e => setFirstName(e.target.value)
  const handleLastName = e => setLastName(e.target.value)
  const handleShowPassword = () => setIsVisibleFirstPassword(!isVisibleFirstPassword)

  const handleSubmit = async event => {
    event.preventDefault()
    event.stopPropagation()

    const form = event.currentTarget
    const isValid = form.checkValidity()
    if (!isValid) {
      setValidated(true)
      return
    }
    if (!termsAccepted) {
      setValidated(true)
      return
    }

    try {
      await register({
        email: email.trim().toLowerCase(),
        password: password,
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null
      })
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setTermsAccepted(false)
      setValidated(false)
      navigate('/signin')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='container min-vh-100 d-flex align-items-center justify-content-center'>
      <Form className='bg-secondary-subtle p-5 rounded' noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className='align-items-center'>
          <Col md={6}>
            <h1 className='text-dark text-center my-5'>Regístrate!</h1>

            <Row className='mb-3'>
              <Form.Group as={Col} md='12' controlId='validationCustomUsername'>
                <Form.Label>Correo electrónico</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id='inputGroupPrepend'>@</InputGroup.Text>
                  <Form.Control
                    type='email'
                    placeholder='correo electrónico'
                    aria-describedby='inputGroupPrepend'
                    required
                    value={email}
                    onChange={handleEmail}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Por favor, introduce un correo electrónico correcto.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className='mb-3'>
              <Form.Group as={Col} md='12' controlId='validationCustom03'>
                <div className='form-floating position-relative mt-2'>
                  <input
                    onChange={handlePassword}
                    type={isVisibleFirstPassword ? 'password' : 'text'}
                    className='form-control'
                    id='floatingPassword'
                    value={password}
                    placeholder='Contraseña'
                    required
                  />
                  <label htmlFor='floatingPassword'>Contraseña</label>
                  <span
                    onClick={handleShowPassword}
                    className='position-absolute top-50 end-0 translate-middle-y pe-5'
                    style={{ cursor: 'pointer' }}
                  >
                    {!isVisibleFirstPassword ? (
                      <i className='fa-solid fa-eye-slash fa-xl'></i>
                    ) : (
                      <i className='fa-solid fa-eye fa-xl text-secondary'></i>
                    )}
                  </span>
                </div>
                <Form.Control.Feedback type='invalid'>
                  Por favor, escribe una contraseña válida.
                </Form.Control.Feedback>

                <div className='form-floating mt-3'>
                  <input
                    type='text'
                    id='first-name'
                    className='form-control'
                    placeholder='Nombre'
                    value={firstName}
                    onChange={handleFirstName}
                  />
                  <label htmlFor='first-name'>Nombre</label>
                </div>

                <div className='form-floating mt-3'>
                  <input
                    type='text'
                    id='last-name'
                    className='form-control'
                    placeholder='Apellidos'
                    value={lastName}
                    onChange={handleLastName}
                  />
                  <label htmlFor='last-name'>Apellidos</label>
                </div>
              </Form.Group>
            </Row>

            <Form.Group className='mb-3'>
              <Form.Check
                required
                type='checkbox'
                label='Acepto los términos y condiciones'
                feedback='Debes aceptar antes de suscribirte.'
                feedbackType='invalid'
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
              />
            </Form.Group>

            <Button type='submit'>Registrarme</Button>
          </Col>

          <Col md={6} className='d-flex justify-content-center align-items-center'>
            <img
              src='https://media.adeo.com/media/1930403/media.png?width=3000&height=3000&format=jpg&quality=80&fit=bounds'
              alt='Imagen registro'
              style={{ width: '80%', height: 'auto', borderRadius: '10px' }}
            />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
