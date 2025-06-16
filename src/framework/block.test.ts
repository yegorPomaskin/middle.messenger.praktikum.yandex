import Block from './block';

describe('Block', () => {
  class TestComponent extends Block {
    render(): string {
      return '<div>Hello</div>';
    }
  }

  class PublicTestComponent extends TestComponent {
    public override render(): string {
      return super.render();
    }
  }

  test('инициализация вызывает render()', () => {
    const renderSpy = jest.spyOn(PublicTestComponent.prototype, 'render');

    new PublicTestComponent({});

    expect(renderSpy).toHaveBeenCalled();
  });

  //   test('setProps вызывает _render', () => {
  //     const block = new TestComponent({ text: 'before' }) as WithPrivate<TestComponent>;
  //     const renderSpy = jest.spyOn(block, '_render');

  //     block.setProps({ text: 'after' });

  //     expect(renderSpy).toHaveBeenCalled();
  //   });

  test('show() делает элемент видимым', () => {
    const block = new TestComponent({});
    document.body.appendChild(block.getContent());

    block.hide();
    expect(block.getContent().style.display).toBe('none');

    block.show();
    expect(block.getContent().style.display).toBe('block');
  });

  test('destroy() удаляет элемент и обработчики', () => {
    const block = new TestComponent({});
    const el = block.getContent();
    document.body.appendChild(el);

    block.destroy();

    expect(document.body.contains(el)).toBe(false);
    expect(() => block.getContent()).toThrow('Элемент еще не создан');
  });
});
