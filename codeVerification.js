// id param is the string id for an HTML form element
(id => {
    const moveForward = e => {
        const sibling = e.target.nextElementSibling

        if (sibling) {
            sibling.focus()
            sibling.selectionStart = sibling.selectionEnd = 0
        }
    }

    const moveBackward = e => {
        const sibling = e.target.previousElementSibling

        if (sibling) {
            sibling.focus()
            sibling.selectionStart = sibling.selectionEnd = sibling.value.length
            e.preventDefault()
        }
    }

    const nextInput = e => {
        const maxInputLength = 4
        const inputLength = e.target.value.length
        const isAlphanumericKey = /^[a-zA-Z0-9]{1}$/.test(e.key)
        const isCaretAtEnd = e.target.selectionEnd === inputLength
        const isCaretAtStart = e.target.selectionEnd === 0
        const isInputMaxLength = inputLength === maxInputLength
        const isNavigationaKey = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)

        e.target.maxLength = maxInputLength
        
        if (!isAlphanumericKey && !isNavigationaKey) {
            e.preventDefault()
            return
        }

        if (isInputMaxLength && isAlphanumericKey && isCaretAtEnd) {
            moveForward(e)
            return
        }

        if (isCaretAtStart && e.key === 'Backspace') {
            moveBackward(e)
            return
        }

        if (isCaretAtEnd && e.key === 'ArrowRight') {
            moveForward(e)
            // preventDefault is needed here because moveForward causes the caret to move to the next input AND
            // then the right-arrow is applied so it moves the caret one unit too far.
            e.preventDefault()
            return
        }

        if (isCaretAtStart && e.key === 'ArrowLeft') {
            moveBackward(e)
            return
        }
    }

    const handleEdgeCase = e => {
        const inputLength = e.target.value.length
        const isAlphanumericKey = /^[a-zA-Z0-9]{1}$/.test(e.key)

        // Checks if the last key entered in an input is alphanumeric. If so, jump to the next input. 
        if (inputLength === 4 && e.target.selectionEnd == inputLength && isAlphanumericKey) {
            moveForward(e)
        }
    }

    const onPaste = (e, inputs) => {
        const maxSections = 3
        const maxSectionLength = 4
        const maxCodeLength = 12
        let text = (e.clipboardData || window.clipboardData).getData('text')
        text = text.trim().toUpperCase().replaceAll("-", "")

        const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(text)

        if (!isAlphanumeric) {
            e.preventDefault()
            return
        }
        
        const numOfSections = text.length > maxCodeLength ? maxSections : Math.ceil(text.length / 4)

        for (let i = 0; i < numOfSections; i++) {
            inputs[i].value = text.slice(maxSectionLength * i, maxSectionLength * (i + 1))
        }

        const lastSection = inputs[numOfSections - 1]
        lastSection.focus()
        lastSection.selectionStart = lastSection.selectionEnd = lastSection.value.length
        
        e.preventDefault()
    }

    const form = document.getElementById(id)
    const inputs = [...form.elements].slice(0, 3)

    form.addEventListener('keydown', nextInput)
    form.addEventListener('keyup', handleEdgeCase)
    form.addEventListener('paste', e => onPaste(e, inputs)) 
})("verification_code")