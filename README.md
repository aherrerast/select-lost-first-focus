`npm install --force`

`npm start`

To reproduce:
1. Click on Keep Focus on the first keystroke/Lose Focus on the first keystroke
2. Click on Add Row

![MEM-6650](https://user-images.githubusercontent.com/99763561/169349155-0b946e7d-e4ec-4928-8032-e44e533d16e3.jpg)

**Expected behavior:**

3a. Select control should be visible and with the focus, after pressing any letter the control should keep the focus and filter the result

**Actual behavior**

3b. Select control should be visible and with the focus, after pressing any letter the the control lose the focus



The code is [available in codesandbox](https://codesandbox.io/s/select-lost-first-focus-lf4df4) but the sandbox is throwing a weird error and currently is not working.
