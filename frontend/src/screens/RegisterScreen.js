import { register } from "../api.js";
import { getUserInfo, setUserInfo } from "../localStorage.js";
import {
  hideLoading,
  redirectUser,
  showLoading,
  showMessage,
} from "../utils.js";

const RegisterScreen = {
  after_render: () => {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        if (
          document.getElementById("repassword").value ===
          document.getElementById("password").value
        ) {
          showLoading();

          const data = await register({
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
          });

          hideLoading();

          if (data.error) {
            showMessage(data.error);
          } else {
            setUserInfo(data);
            redirectUser();
          }
        } else {
          const repasswordReq = document.createElement("div");
          repasswordReq.classList.add("requirements", "warning");
          repasswordReq.textContent = "Passwords must match."; // can't chain these methods because

          document
            .getElementById("repassword")
            .insertAdjacentElement("afterend", repasswordReq);
        }
      });
  },
  render: () => {
    if (getUserInfo().name) {
      redirectUser();
    }
    return `
      <div class="form-container">
        <form id="register-form">
          <ul class="form-items">
            <li>
              <h1>Create Account</h1>
            </li>
            <li>
              <label for="name">Name</label>
              <input name="name" id="name" /> 
            </li>
            <li>
              <label for="email">Email</label>
              <input name="email" id="email" />
              <div class="requirements">example@example.example</div>
            </li>
            <li>
              <label for="password">Password</label>
              <input type="password" name="password" id="password" /> 
              <div class="requirements">Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&).</div>
            </li>
            <li>
              <label for="repassword">Re-Enter Password</label>
              <input type="password" name="repassword" id="repassword" /> 
            </li>
            <li>
              <button type="submit" class="primary">Register</button>
            </li>
            <li>
              <div>
                Already have an account?
                <a href="/#/signin">Sign-In</a>
              </div>
            </li>
          </ul>
        </form>
      </div>
    `;
  },
};

export default RegisterScreen;
