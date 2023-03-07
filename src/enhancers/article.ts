import { ChildEnhancerBuilder, enhance, EnhancerBuilder } from '@uniformdev/canvas';
import { EnhanceParameter } from '@/utilities';
import { getCompositionProps } from '@/utilities/canvas';
import { AppPages } from '@/constants';

export interface ContentfulArticle {
  slug: string;
  [name: string]: unknown;
}

const getArticleComponentParameterEnhancer = (article: ContentfulArticle) => (builder: ChildEnhancerBuilder) => {
  builder.data('content', () => article);
};

export const enhancerCustomExtenderFactory = (article: ContentfulArticle) => (enhancer: EnhancerBuilder) => {
  enhancer.component('article', getArticleComponentParameterEnhancer(article));
};

const getAllArticles =
  (articlesHashMapper: { [name: string]: unknown }) =>
  ({ parameter }: EnhanceParameter<{ slug: string }[]>) =>
    parameter.value.forEach(article => {
      articlesHashMapper[article.slug] = article;
    });

export const getArticles = async (preview?: boolean): Promise<{ [name: string]: ContentfulArticle } | null> =>
  getCompositionProps({ slug: AppPages.Articles, context: { preview } })
    .then(({ composition }) => {
      const articlesHashMapper = {};
      return enhance({
        composition,
        enhancers: new EnhancerBuilder().parameterType(['contentfulMultiEntry', 'contentfulQuery'], {
          enhanceOne: getAllArticles(articlesHashMapper),
        }),
        context: { preview },
      })
        .then(() => articlesHashMapper)
        .catch(() => null);
    })
    .catch(() => null);
