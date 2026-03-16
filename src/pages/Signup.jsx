const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log(data, error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Account created!");
  console.log(email, password);
};