<script lang="ts">
  import './Editor.scss';
  import {createStyles, globalCss, type CSS} from '@svelteuidev/core';

  const globalStyles = globalCss({
    '@import': [
      'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap',
      'https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;700;900&display=swap'
    ],

    ':root': {
      '--editor-font': "'Literata', serif",
      '--editor-font-heading': "'Bitter', serif",
      '--editor-font-code': "'Fira Code', monospace",
      '--editor-font-size': '1.1rem',
      '--editor-font-height': '1.7rem',
      '--editor-block-gap': '16px'
    }
  });

  export let override: CSS = {};

  const useStyles = createStyles(theme => {
    return {
      root: {
        [`${theme.dark}`]: {},
        '& .ProseMirror': {
          outline: 'none',
          position: 'relative',
          display: 'block',
          '& > p,figure,blockquote': {
            borderRadius: 4
          },
          '& .ProseMirror-selectednode': {
            outline: '2px solid $green200',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
          },

          //-----Paragraph block-----
          '& p': {
            margin: 0,
            lineHeight: 'var(--editor-font-height)',
            fontSize: 'var(--editor-font-size)',
            fontFamily: 'var(--editor-font)',
            fontWeight: 400,
            marginBottom: 'var(--editor-block-gap)',
            color: theme.colors.dark500.value,
            '&.is-editor-empty:first-child:before': {
              color: '#adb5bd',
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none'
            },
            '&.is-block-empty:before': {
              color: '#adb5bd',
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none'
            },
            '& code': {
              backgroundColor: 'hsl(206, 44%, 93%)',
              padding: '2px',
              fontFamily: 'Fira Mono, monospace',
              fontSize: '0.9rem',
              fontWeight: 400,
              color: 'var(--svelteui-colors-red700)',
              borderRadius: '4px'
            }
          },
          //-------End Paragraph block-----

          '& a': {
            color: theme.colors.blue400.value,
            textDecoration: 'underline',
            cursor: 'pointer'
          },
          //-------Heading block-----------
          '& h1,h2,h3,h4,h5,h6': {
            margin: 0,
            fontFamily: 'var(--editor-font-heading)',
            color: theme.colors.dark400.value,
            marginTop: 'var(--editor-block-gap)',
            borderRadius: 4
          },
          '& h1': {
            fontSize: '2.2rem',
            lineHeight: '3.3rem',
            fontWeight: 700
          },
          '& h2': {
            fontSize: '1.8rem',
            lineHeight: '2.7rem',
            fontWeight: 700
          },
          '& h3': {
            fontSize: '1.6rem',
            lineHeight: '2.4rem',
            fontWeight: 700
          },
          '& h4': {
            fontSize: '1.2rem',
            lineHeight: '2.4rem',
            fontWeight: 700
          },
          //---------End Heading block-----

          //---------Divider block-----------
          '& hr': {
            borderTop: '2px solid var(--svelteui-colors-gray500)',
            margin: 'calc(var(--editor-block-gap) + 8px) 0'
          },
          //------End Divider-----,

          //------List block-----------
          '& ul,ol': {
            padding: '0 1rem',
            marginLeft: '8px',
            borderRadius: 4
          },
          '& ul': {
            listStyle: 'disc',
            marginBottom: 'var(--editor-block-gap)'
          },
          '& ol': {
            listStyleType: 'decimal',
            marginBottom: 'var(--editor-block-gap)'
          },
          //---------End List block-----

          //-------Start inline style
          '& em': {
            fontStyle: 'italic'
          },
          '& strong': {
            fontWeight: 700
          },
          '& .nextlint-link': {
            color: theme.colors.blue400.value
          },
          //-----------Inline style-----------
          '& blockquote': {
            boxSizing: 'border-box',
            margin: 0,
            marginBottom: 'var(--editor-block-gap)',
            backgroundColor: ' var(--svelteui-colors-gray100)',
            border: 'solid 2px var(--svelteui-colors-gray200)',
            borderRadius: '4px',
            display: 'inline-block',
            padding: '8px',
            width: '100%',
            color: theme.colors.dark400.value,
            '& p': {
              margin: 0
            }
          },

          //-----------Image block-----------
          '& figure': {
            margin: 0,
            width: '100%',
            marginBottom: 'var(--editor-block-gap)',
            flexDirection: 'column',
            '& figcaption': {
              margin: '4px 0',
              outline: 'none',
              fontStyle: 'italic',
              fontSize: '15px',
              fontFamily: 'var(--editor-font)',
              color: theme.colors.dark500.value
            }
          },
          '& img': {
            borderRadius: 8,
            width: 'inherit',
            maxHeight: 700
          },
          //---------End Image block-----
          '& s': {
            textDecoration: 'line-through'
          },
          '& u': {
            textDecoration: 'underline'
          }
        }
      }
    };
  });

  $: ({getStyles} = useStyles());
  globalStyles();
</script>

<div class={getStyles({css: override})}>
  <slot />
</div>
